import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '../../../../../presentation/pages/forms/components/SearchBar';

jest.mock('lodash/debounce', () => jest.fn((fn) => fn));

describe('FormsPageController', () => {
  let onQueryComplete: jest.Mock<
    void,
    [
      {
        queryText: string;
        SDCFormIds: string[];
        diagnosticProcedureIds: string[];
      }
    ]
  >;

  beforeAll(() => {
    onQueryComplete = jest.fn();
  });

  test('should parse query and call callback', () => {
    const { getByRole } = render(
      <SearchBar onQueryComplete={onQueryComplete} />
    );
    const searchbox = getByRole('searchbox');
    fireEvent.change(searchbox, {
      target: {
        value:
          'this form-id:abc1 dp-id:xyz1 is a query dp-id:xyz2 form-id:abc2',
      },
    });

    expect(onQueryComplete).toHaveBeenCalledWith({
      SDCFormIds: ['abc1', 'abc2'],
      queryText: 'this is a query',
      diagnosticProcedureIds: ['xyz1', 'xyz2'],
    });
  });
});
