const puppeteer = require('puppeteer');
const fs = require('fs');

const baseUrl = 'https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/courses';


// TODO: fix tree parsing
const makeListIntoTree = async (page, prereqList) => {
    let innerText = "" + await page.evaluate(prereqList => prereqList.innerText, prereqList);
    console.log(innerText);
    if (innerText == null) return null;

    const matches = innerText.match('.+following')

    if (!matches || matches.length == 0) {
        return innerText;
    }


    const nextListItems = await prereqList.$$('li');
    
    const stepReqs = [];
    for (let i = 0; i < nextListItems.length; i++) {
        const nextListItem = nextListItems[i];
        const req = await makeListIntoTree(page, nextListItem);
        if (!!req) stepReqs.push(req);
    }

    const tree = {}
    tree[matches[0]] = stepReqs;

    return tree;
}

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
    }

    // Find the antireqs div
    const antireqsListDiv = await page.$('h3 ::-p-text(Antirequisites) + div');
    if (!!antireqsListDiv) {
        const antireqList = await antireqsListDiv.$('li');
        const antireqHtml = await page.evaluate(antireqList => antireqList.innerHTML, antireqList);
        course['antireqHtml'] = antireqHtml;
    }

    // Find the coreqs div
    const coreqsListDiv = await page.$('h3 ::-p-text(Corequisites) + div');
    if (!!coreqsListDiv) {
        const coreqList = await coreqsListDiv.$('li');
        const coreqHtml = await page.evaluate(coreqList => coreqList.innerHTML, coreqList);
        course['coreqHtml'] = coreqHtml;
    }
    
    // TODO: fix tree parsing
    // let prereqTree = await makeListIntoTree(page, prereqList);

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
    
    // course['prereqTree'] = prereqTree;
    // course['antireqTree'] = ;
    // course['prereqs'] = ;
    // course['antireqs'] = ;
    course['updatedAt'] = new Date();

    // Close the browser
    await browser.close();

    return course;

    // code: string;            done
    // faculty?: string;        done
    // classNumber?: number;    done
    // name: string;            done
    // prereqsRaw?: string;
    // prereqs?: string;
    // antireqs?: string;
    // antireqsRaw?: string;
    // ratings?: number;
    // useful?: number;
    // easy?: number;
    // updatedAt?: Date;        done
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
