const puppeteer = require('puppeteer');
const baseUrl = 'https://uwaterloo.ca/academic-calendar/undergraduate-studies/catalog#/courses';


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
    const prereqsList = await page.waitForSelector('h3 ::-p-text(Description) + ul');

    
    course['code'] = courseCode;
    course['humanCode'] = humanCode;
    course['faculty'] = faculty;
    course['classNumber'] = courseNumber;
    course['name'] = name;
    course['description'] = description;
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
