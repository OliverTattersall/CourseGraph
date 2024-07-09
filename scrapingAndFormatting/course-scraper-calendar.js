const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = 'https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/courses';




/**
 * 
 * @param {puppeteer.Page} page 
 * @param {puppeteer.ElementHandle<Element> | null} prereqList 
 * @returns 
 */
const makeListItemIntoTree = async (page, prereqList) => {
    let innerText = "" + await page.evaluate(prereqList => prereqList.innerText, prereqList);
    if (innerText == null) return null;

    // Figure out if there are any sub-lists
    // TODO: get a better regex for antireq list declarations
    const matches = innerText.match('(.+following)|(.+:\\s*)')

    // If no sub-lists, return true
    if (!matches || matches.length == 0) {
        // Check if it is a course
        const regexTitle = innerText.match('(.+) - .+');
        if (regexTitle) return regexTitle[1];
        return innerText;
    }

    // Get the list items that are children of the next unordered list
    const subList = await prereqList.$('ul');
    await page.evaluate(subList => subList.setAttribute('class', 'processed'), subList);
    const nextListItems = await prereqList.$$('.processed > li');
    const parentedNextListIems = await prereqList.$$('.processed > div > li');
    
    const stepReqs = [];
    for (const nextListItem of parentedNextListIems) {
        const req = await makeListItemIntoTree(page, nextListItem);
        if (!!req) stepReqs.push(req);
    }
    for (const nextListItem of nextListItems) {
        const req = await makeListItemIntoTree(page, nextListItem);
        if (!!req) stepReqs.push(req);
    }

    const tree = {}
    tree[matches[0]] = stepReqs;

    return tree;
}

/**
 * Scrapes a course's page.
 * @param {puppeteer.Page} page 
 * @returns 
 */
const scrapeCoursePage = async (page) => {
    // Find the course name
    const titleRef = await page.waitForSelector('h2 ::-p-text( - )');
    const title = await page.evaluate(titleRef => titleRef.innerText, titleRef);
    console.log(title);
    const regexTitle = title.match('(.+) - (.+)');
    const courseCode = regexTitle[1];
    const name = regexTitle[2];

    const regexCode = courseCode.match('([A-Z]+)(.+)');
    const faculty = regexCode[1];
    const courseNumber = regexCode[2];

    // Find the description
    const descriptionDiv = await page.waitForSelector('h3 ::-p-text(Description) + div');
    const description = await page.evaluate((descDiv => descDiv.innerText), descriptionDiv);

    const course = {};

    course['code'] = courseCode;
    course['faculty'] = faculty;
    course['classNumber'] = courseNumber;
    course['name'] = name;
    course['description'] = description;

    // Find the prereqs div
    const prereqsListDiv = await page.$('h3 ::-p-text(Prerequisites) + div');
    if (!!prereqsListDiv) {
        const prereqList = await prereqsListDiv.$('li');
        const prereqHtml = await page.evaluate(prereqList => prereqList.innerHTML, prereqList);
        course['prereqHtml'] = prereqHtml;

        let prereqTree = await makeListItemIntoTree(page, prereqList);
        course['prereqs'] = prereqTree;
    }

    // Find the antireqs div
    const antireqsListDiv = await page.$('h3 ::-p-text(Antirequisites) + div');
    if (!!antireqsListDiv) {
        const antireqList = await antireqsListDiv.$('li');
        const antireqHtml = await page.evaluate(antireqList => antireqList.innerHTML, antireqList);
        course['antireqHtml'] = antireqHtml;

        let antireqTree = await makeListItemIntoTree(page, antireqList);
        course['antireqs'] = antireqTree;
    }

    // Find the coreqs div
    const coreqsListDiv = await page.$('h3 ::-p-text(Corequisites) + div');
    if (!!coreqsListDiv) {
        const coreqList = await coreqsListDiv.$('li');
        const coreqHtml = await page.evaluate(coreqList => coreqList.innerHTML, coreqList);
        course['coreqHtml'] = coreqHtml;

        let coreqTree = await makeListItemIntoTree(page, coreqList);
        course['coreqs'] = coreqTree;
    }

    return course;
}

/**
 * Scrapes the course from the UW undergraduate calendar.
 * @param {string} courseCode 
 * @returns JSON object that represents the course
 */
const scrapeCourse = async (courseCode) => {
    const courseRegex = courseCode.match('(\\D+)(\\d+.*)');
    const faculty = courseRegex[1].toUpperCase();
    const courseNumber = courseRegex[2].toUpperCase();
    const humanCode = `${faculty} ${courseNumber}`;

    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 75, 
    });

    // Open a new page
    const page = await browser.newPage();

    await page.goto(baseUrl, {
        waitUntil: "domcontentloaded",
    });

    // Click on the faculty accordion
    const facultyCourses = await page.waitForSelector(`h2 ::-p-text((${faculty}))`);
    await facultyCourses.click();

    // Click into the course page
    const courseLink = await page.waitForSelector(`a ::-p-text(${courseCode.toUpperCase()} - )`);
    await courseLink.click();

    const course = await scrapeCoursePage(page);
    
    course['updatedAt'] = new Date();

    // Close the browser
    await browser.close();

    return course;
}


// TODO: incomplete method
/**
 * Scrapes all of the courses from a specified faculty from the UW undergraduate calendar.
 * @param {puppeteer.Browser} browser
 * @param {string} faculty 
 * @returns JSON object that represents the course
 */
const scrapeFaculty = async (browser, faculty) => {
    const faculty = courseRegex[1].toUpperCase();

    // Open a new page
    const page = await browser.newPage();

    await page.goto(baseUrl, {
        waitUntil: "domcontentloaded",
    });

    // Click on the faculty accordion
    const facultyCourses = await page.waitForSelector(`h2 ::-p-text((${faculty}))`);
    await facultyCourses.click();

    // Click into the course page
    await page.waitForSelector(`a ::-p-text(${courseCode.toUpperCase()} - )`);
    const courseLinks = page.$$(`a ::-p-text( - )`);

    const data = {};
    for (const courseLink of courseLinks) {
        await courseLink.click();

        const course = await scrapeCoursePage(page);
        
        course['updatedAt'] = new Date();
        data[course['code']] = course;
    }

    // Close the browser
    await browser.close();

    data[course['code']] = course;
}

const saveAndScrape = async () => {
    const coursesToScrape = ['cs241', 'cs136l', 'math136'];
    let data = {}

    for (let i = 0; i < coursesToScrape.length; i++) {
        const courseCode = coursesToScrape[i];
        data[courseCode] = await scrapeCourse(courseCode);
    }
    
    // Convert the JSON object to a string
    const jsonString = JSON.stringify(data, null, 2);
    
    // Define the file path
    const filePath = './courses.json';
    
    // Write the JSON string to a file
    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('JSON data saved to file');
        }
    });
}


saveAndScrape();
