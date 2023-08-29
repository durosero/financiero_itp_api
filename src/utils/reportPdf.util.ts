import { readFileSync } from 'fs';
import handlebars, { HelperOptions } from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as moment from 'moment';
import * as currency from 'currency-formatter';
var locateChrome = require('locate-chrome');

const defaultConfigPDF: puppeteer.PDFOptions = {
  format: 'a4',
  margin: { top: '20px', right: '50px', bottom: '70px', left: '50px' },
  width: '1920px',
  height: '1080px',
  printBackground: true,
  scale: 1,
  displayHeaderFooter: true,
  headerTemplate: '<span></span>',
};

export const convertHTMLtoPDF = async (
  html: string,
  configPDF: puppeteer.PDFOptions = defaultConfigPDF,
) => {
  const executablePath: string =
    (await new Promise((resolve) =>
      locateChrome((arg: any) => resolve(arg)),
    )) || '';
  const browser = await puppeteer.launch({
    executablePath,
    args: [
      '--no-sandbox',
      '--headless',
      '--disable-gpu',
      '--disable-setuid-sandbox',
    ],
  });

  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf(configPDF);
  await browser.close();
  return pdf;
};

export const compileHBS = (pathTemplate: string, params: object): string => {
  try {
    const rawTemplate = readFileSync(pathTemplate, 'utf-8');
    const engine = handlebars.compile(rawTemplate);
    return engine(params);
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const initializeHelpersHbs = () => {
  handlebars.registerHelper('inc', (value) => parseInt(value, 10) + 1);
  const ifCond = (v1: unknown, v2: unknown, options: HelperOptions) => {
    if (v1 === v2) {
      return options.fn(this);
    }
    return options.inverse(this);
  };
  handlebars.registerHelper('ifCond', ifCond);

  handlebars.registerHelper('formatDate', function (datetime) {
    return moment(datetime).format('DD-MM-YYYY HH:mm:ss A');
  });

  handlebars.registerHelper('formatDateFull', function (datetime) {
    return moment(datetime).locale('es-CO').format('LLLL');
  });

  handlebars.registerHelper('empty', function (value) {
    return !value ? 'NO APLICA' : value;
  });

  handlebars.registerHelper('formatCurrency', function (value) {
    return currency.format(value, { locale: 'es-CO' }).replace('$', '').trim();
  });
};
