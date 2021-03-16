import parser from 'fast-xml-parser';
import he from 'he';
import * as SDC from './types';
import { SDCFormConverter } from './normalize';
import { SDCForm } from 'domain/entities/SDCForm';

const options: Partial<parser.X2jOptions> = {
  attributeNamePrefix: '',
  attrNodeName: SDC.SDCAttributeName, //default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: true,
  trimValues: true,
  cdataTagName: '__cdata', //default is 'false'
  cdataPositionChar: '\\c',
  parseTrueNumberOnly: false,
  arrayMode: false, //"strict"
  attrValueProcessor: (val: string /**attrName: string*/) =>
    he.decode(val, { isAttributeValue: true }), //default is a=>a
  tagValueProcessor: (val: string /**tagName*/) => he.decode(val), //default is a=>a
  stopNodes: ['parse-me-as-string'],
};

/**
 * This will parse an SDC XML string and return an SDCForm.
 * @param xmlString The XML string to parse.
 */
export const parseSDCXML = (xmlString: string): SDCForm | null => {
  if (parser.validate(xmlString) === true) {
    // optional (it'll return an object in case it's not valid)
    let ret: SDC.FormDesign;
    const jsonObj = parser.parse(xmlString, options);

    if (Object.keys(jsonObj).includes('SDCPackage')) {
      ret = (jsonObj as SDC.SDCPackage).SDCPackage.XMLPackage.FormDesign;
    } else {
      ret = jsonObj.FormDesign;
    }

    const normalized = SDCFormConverter.normalizeRawSDC(ret);

    return normalized;
  }

  return null;
};
