/**
 * THIS PARSER IS SUPPOSED TO BE SEPARATE FROM SERVER-SIDE CODE
 *
 * Please run npm run parser-test at the root of this directory in order
 *  to build and run this index file.
 */

import fs from 'fs';
import { parseSDCXML } from '../../data/SDCForm/parser/SDCFormXMLParser';
import { generateInitialSDCFormResponse } from '../../domain/usecases/SDCFormResponse/getDefaultSDCFormResponse/utils';
import { ValidateSDCFormResponseUseCase } from '../../domain/usecases/SDCFormResponse/validateSDCFormResponse';

const path = 'src/mirage/parser/',
  distOutputPath = 'dist/__tests__/mirage/parser/',
  forStudentsFileName = 'PKG_LDCT_LUNG_forStudents.xml',
  forStudentsOutputFile = 'forStudents.json',
  forStudentsDefaultSDCFROutputFile = 'DefaultSDCFormResponse_forStudents.json',
  forStudentsDefaultSDCFRValidationResultOutputFile =
    'ValidationResult_forStudentsDefaultSDCFR.json',
  CTSTROKEFileName = 'PKG_ACR_CT_STROKE.xml',
  CTSTROKEOutputFile = 'PKG_ACR_CT_STROKE.json',
  CTSTROKEDefaultSDCFROutputFile =
    'DefaultSDCFormResponse_PKG_ACR_CT_STROKE.json',
  CTSTROKEDefaultSDCFRValidationResultOutputFile =
    'ValidationResult_PKG_ACR_CT_STROKEDefaultSDCFR.json',
  PKGTHYROIDUSFileName = 'PKG_THYROID_US.xml',
  PKGTHYROIDUSOutputFile = 'PKG_THYROID_US.json',
  PKGTHYROIDUSDefaultSDCFROutputFile =
    'DefaultSDCFormResponse_PKG_THYROID_US.json',
  PKGTHYROIDUSDefaultSDCFRValidationResultOutputFile =
    'ValidationResult_PKG_THYROID_USDefaultSDCFR.json',
  PKGLungSurgeryCCOFileName = 'PKG_Lung_Surgery_CCO.xml',
  PKGLungSurgeryCCOOutputFile = 'PKG_Lung_Surgery_CCO.json',
  PKGLungSurgeryCCODefaultSDCFROutputFile =
    'DefaultSDCFormResponse_PKG_Lung_Surgery_CCO.json',
  PKGLungSurgeryCCODefaultSDCFRValidationResultOutputFile =
    'ValidationResult_PKG_Lung_Surgery_CCODefaultSDCFR.json',
  Adrenal129FileName = 'Adrenal.Bx.Res.129_3.003.001.REL_sdcFDF.xml',
  Adrenal129OutputFile = 'Adrenal.Bx.Res.129_3.003.001.REL_sdcFDF.json',
  Adrenal129DefaultSDCFROutputFile =
    'DefaultSDCFormResponse_Adrenal.Bx.Res.129_3.003.001.REL_sdcFDF.json',
  Adrenal129DefaultSDCFRValidationResultOutputFile =
    'ValidationResult_Adrenal.Bx.Res.129_3.003.001.REL_sdcFDFDefaultSDCFR.json',
  Appendix135FileName = 'Appendix.Res.135_3.002.001.REL_sdcFDF.xml',
  Appendix135OutputFile = 'Appendix.Res.135_3.002.001.REL_sdcFDF.json',
  Appendix135DefaultSDCFROutputFile =
    'DefaultSDCFormResponse_Appendix.Res.135_3.002.001.REL_sdcFDF.json',
  Appendix135DefaultSDCFRValidationResultOutputFile =
    'ValidationResult_Appendix.Res.135_3.002.001.REL_sdcFDFDefaultSDCFR.json',
  ins = [
    forStudentsFileName,
    CTSTROKEFileName,
    PKGTHYROIDUSFileName,
    PKGLungSurgeryCCOFileName,
    Adrenal129FileName,
    Appendix135FileName,
  ],
  outs = [
    forStudentsOutputFile,
    CTSTROKEOutputFile,
    PKGTHYROIDUSOutputFile,
    PKGLungSurgeryCCOOutputFile,
    Adrenal129OutputFile,
    Appendix135OutputFile,
  ],
  defaultSDCFormResponseOuts = [
    forStudentsDefaultSDCFROutputFile,
    CTSTROKEDefaultSDCFROutputFile,
    PKGTHYROIDUSDefaultSDCFROutputFile,
    PKGLungSurgeryCCODefaultSDCFROutputFile,
    Adrenal129DefaultSDCFROutputFile,
    Appendix135DefaultSDCFROutputFile,
  ],
  defaultSDCFormResponseValidationResultOuts = [
    forStudentsDefaultSDCFRValidationResultOutputFile,
    CTSTROKEDefaultSDCFRValidationResultOutputFile,
    PKGTHYROIDUSDefaultSDCFRValidationResultOutputFile,
    PKGLungSurgeryCCODefaultSDCFRValidationResultOutputFile,
    Adrenal129DefaultSDCFRValidationResultOutputFile,
    Appendix135DefaultSDCFRValidationResultOutputFile,
  ];

if (
  ins.length !== outs.length ||
  ins.length !== defaultSDCFormResponseOuts.length ||
  ins.length !== defaultSDCFormResponseValidationResultOuts.length
) {
  throw new Error(
    'Please make sure the amount of input files and output files are the same.'
  );
}

for (let i = 0; i < ins.length; i++) {
  const inputFileName = ins[i],
    outputFileName = outs[i],
    SDCFROutputFileName = distOutputPath + defaultSDCFormResponseOuts[i],
    SDCFRValidationOutputFileName =
      distOutputPath + defaultSDCFormResponseValidationResultOuts[i],
    outputFile = distOutputPath + outputFileName;

  const xmlData = fs.readFileSync(`${path}${inputFileName}`).toString('utf-8');
  const normalized = parseSDCXML(xmlData);

  if (normalized) {
    const initialSDCFormResponse = generateInitialSDCFormResponse(normalized);
    fs.writeFileSync(
      SDCFROutputFileName,
      JSON.stringify(initialSDCFormResponse)
    );

    new ValidateSDCFormResponseUseCase()
      .execute({
        sdcFormResponse: initialSDCFormResponse,
        sdcForm: normalized,
      })
      .then((data) => {
        data.caseOf({
          Right: (result) => {
            fs.writeFileSync(
              SDCFRValidationOutputFileName,
              JSON.stringify(result)
            );
          },
          Left: (err) => {
            err.message;
          },
        });
      });
  }

  fs.writeFileSync(outputFile, JSON.stringify(normalized));
}
