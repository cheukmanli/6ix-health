import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';

const PatientsListItemInputMock = () => {
  const [patientName, setPatientName] = useState('Evan Younan');

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const isAlphabetic = /^[a-zA-Z ]+$/.test(e.target.value);
    const isEmpty = e.target.value.length === 0;
    if (isAlphabetic || isEmpty) {
      setPatientName(e.target.value);
    }
  };

  return (
    <input
      value={patientName}
      aria-label="patient-name-input"
      onChange={onNameChange}
    />
  );
};

describe('PatientsListItem', () => {
  test("Should keep the input's name the same if non alphabetic value provided", () => {
    const rtl = render(<PatientsListItemInputMock />);

    fireEvent.change(rtl.getByLabelText('patient-name-input'), {
      target: { value: '0000000000' },
    });

    expect(rtl.getByDisplayValue('Evan Younan')).toBeTruthy();
  });

  test("Should keep the input's name the same if symbol is provided", () => {
    const rtl = render(<PatientsListItemInputMock />);

    fireEvent.change(rtl.getByLabelText('patient-name-input'), {
      target: { value: '$' },
    });

    expect(rtl.getByDisplayValue('Evan Younan')).toBeTruthy();
  });
});
