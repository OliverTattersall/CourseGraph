const Course = require('./classes.js');

const puppeteer = require('puppeteer');
const baseUrl = 'https://uwflow.com/course/';
const sleepTime = 4000;


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

    await page.goto(baseUrl + courseCode, {
        waitUntil: "domcontentloaded",
    });

    // await new Promise((res) => setTimeout(res, sleepTime));

    const detailsTextRef = await page.waitForSelector('div ::-p-text(Offered:)')

    const details = await page.evaluate(detailsTextRef => detailsTextRef.innerHTML, detailsTextRef);

    const prereqTextRef = await page.waitForSelector('div ::-p-text(prerequisites)');

    

    const prereqText = await page.evaluate(prereqTextRef => {
        const detailsBox = prereqTextRef.parentElement;
        return detailsBox.children[1].textContent;
    }, prereqTextRef)

    course['code'] = courseCode;
    course['humanCode'] = humanCode;
    course['prereqsRaw'] = prereqText;
    course['details'] = details;

    console.log(course);
    

    // Close the browser
    await browser.close();
}

scrapeCourse('cs241');
