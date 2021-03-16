import axios from 'axios';
import SDCFormRepositoryImpl from '../../../infrastructure/sdcForm/SDCFormRepositoryImpl';
import { SDCForm } from '../../../domain/sdcForm/SDCForm';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const mockedFile = <File>{ text: () => Promise.resolve('Some file contents') };

const mockedForms = [
  {
    SDCFormId: 'id-1',
    Version: 1,
    DiagnosticProcedureId: '1',
    Title: '1',
    LastModified: '1',
  },
  {
    SDCFormId: 'id-2',
    Version: 2,
    DiagnosticProcedureId: '2',
    Title: '2',
    LastModified: '2',
  },
];

mockedAxios.delete.mockResolvedValue({ data: {}, status: 200 });
mockedAxios.get.mockResolvedValue({ data: mockedForms, status: 200 });
mockedAxios.post.mockResolvedValue({ data: {}, status: 200 });
mockedAxios.put.mockResolvedValue({ data: mockedForms, status: 200 });

describe('SDCFormRepositoryImpl', () => {
  let sdcFormRepository: SDCFormRepositoryImpl;

  beforeEach(() => {
    sdcFormRepository = new SDCFormRepositoryImpl();
  });

  describe('addSDCForm', () => {
    it('should post form xml as string on endpoint', async () => {
      const form = await sdcFormRepository.addSDCForm(mockedFile);

      expect(form).toBeInstanceOf(SDCForm);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        XMLString: 'Some file contents',
      });
    });
  });

  describe('getAllSDCForms', () => {
    it('should get all forms from endpoint', async () => {
      const forms = await sdcFormRepository.getAllSDCForms();

      forms.map((form) => expect(form).toBeInstanceOf(SDCForm));
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/SDCForm/');
    });
  });

  describe('getSDCFormsByIds', () => {
    it('should call endpoint with correct query parameters', async () => {
      const forms = await sdcFormRepository.getSDCFormsByIds('1');

      forms.map((form) => expect(form).toBeInstanceOf(SDCForm));
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        params: { SDCFormIds: ['1'] },
      });
    });
  });

  describe('querySDCForms', () => {
    it('should call endpoint with all query parameters', async () => {
      const forms = await sdcFormRepository.querySDCForms(
        ['abc-1', 'abc-2'],
        ['xyz-1', 'xyz-2'],
        'This is a query'
      );
      forms.map((form) => expect(form).toBeInstanceOf(SDCForm));
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        params: {
          SDCFormIds: 'abc-1,abc-2',
          diagnosticProcedureIds: 'xyz-1,xyz-2',
          query: 'This is a query',
        },
      });
    });

    it('should call endpoint with only "SDCFormIds" query parameter', async () => {
      await sdcFormRepository.querySDCForms(['abc-1', 'abc-2'], [], '');
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        params: { SDCFormIds: 'abc-1,abc-2' },
      });
    });

    it('should call endpoint with only "diagnosticProcedureIds" query parameter', async () => {
      await sdcFormRepository.querySDCForms([], ['xyz-1', 'xyz-2'], '');
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        params: { diagnosticProcedureIds: 'xyz-1,xyz-2' },
      });
    });

    it('should call endpoint with only "query" query parameter', async () => {
      await sdcFormRepository.querySDCForms([], [], 'This is a query');
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        params: { query: 'This is a query' },
      });
    });
  });

  describe('updateSDCForm', () => {
    it('should call endpoint with correct body', async () => {
      const sdcForm = new SDCForm({ SDCFormId: 'id-1' });
      const form = await sdcFormRepository.updateSDCForm(sdcForm, mockedFile);

      expect(form).toBeInstanceOf(SDCForm);
      expect(mockedAxios.put).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        SDCFormId: 'id-1',
        XMLString: 'Some file contents',
      });
    });
  });

  describe.skip('deleteSDCForm', () => {
    it('should call DELETE on endpoint with correct query param', async () => {
      await sdcFormRepository.deleteSDCForm('id-1');

      expect(mockedAxios.delete).toHaveBeenCalledWith('/api/v1/SDCForm/', {
        params: { SDCFormIds: ['id-1'] },
      });
    });
  });
});
