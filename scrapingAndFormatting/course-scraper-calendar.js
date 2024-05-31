const puppeteer = require('puppeteer');
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

const scrapeCourse = async (courseCode) => {
    const len = courseCode.length;
    const faculty = courseCode.substring(0, len - 3).toUpperCase();
    const courseNumber = Number(courseCode.substring(len - 3));
    const humanCode = `${faculty} ${courseNumber}`;
    const course = {};

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

    // Find the course name
    const titleRef = await page.waitForSelector(`h2 ::-p-text(${courseCode.toUpperCase()} - )`);
    const title = await page.evaluate(titleRef => titleRef.innerText, titleRef);
    const name = title.substring(`${courseCode.toUpperCase()} - `.length);

    // Find the description
    const descriptionDiv = await page.waitForSelector('h3 ::-p-text(Description) + div');
    const description = await page.evaluate((descDiv => descDiv.innerText), descriptionDiv);

    // Find the prereqs div
    const prereqsListDiv = await page.waitForSelector('h3 ::-p-text(Prerequisites) + div');
    const prereqList = await prereqsListDiv.$('li');
    
    // TODO: fix tree parsing
    // let prereqTree = await makeListIntoTree(page, prereqList);

    
    course['code'] = courseCode;
    course['humanCode'] = humanCode;
    course['faculty'] = faculty;
    course['classNumber'] = courseNumber;
    course['name'] = name;
    course['description'] = description;
    // course['prereqTree'] = prereqTree;
    // course['antireqTree'] = ;
    // course['prereqs'] = ;
    // course['antireqs'] = ;
    course['updatedAt'] = new Date();

    console.log(course);

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

    // Close the browser
    await browser.close();
}

scrapeCourse('cs241');
