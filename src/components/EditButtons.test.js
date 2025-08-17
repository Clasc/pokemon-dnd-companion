import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditButtons from './EditButtons';

describe('EditButtons', () => {
  const handleSaveMock = jest.fn();
  const handleCancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the save and cancel buttons', () => {
    render(<EditButtons handleSave={handleSaveMock} handleCancel={handleCancelMock} />);

    expect(screen.getByText('✅ Save')).toBeInTheDocument();
    expect(screen.getByText('❌ Cancel')).toBeInTheDocument();
  });

  it('calls the handleSave function when the save button is clicked', () => {
    render(<EditButtons handleSave={handleSaveMock} handleCancel={handleCancelMock} />);

    const saveButton = screen.getByText('✅ Save');
    fireEvent.click(saveButton);

    expect(handleSaveMock).toHaveBeenCalledTimes(1);
  });

  it('calls the handleCancel function when the cancel button is clicked', () => {
    render(<EditButtons handleSave={handleSaveMock} handleCancel={handleCancelMock} />);

    const cancelButton = screen.getByText('❌ Cancel');
    fireEvent.click(cancelButton);

    expect(handleCancelMock).toHaveBeenCalledTimes(1);
  });

  it('does not call the other function when a button is clicked', () => {
    render(<EditButtons handleSave={handleSaveMock} handleCancel={handleCancelMock} />);

    const saveButton = screen.getByText('✅ Save');
    fireEvent.click(saveButton);

    expect(handleSaveMock).toHaveBeenCalledTimes(1);
    expect(handleCancelMock).not.toHaveBeenCalled();

    const cancelButton = screen.getByText('❌ Cancel');
    fireEvent.click(cancelButton);

    expect(handleSaveMock).toHaveBeenCalledTimes(1); // Still 1 from the previous click
    expect(handleCancelMock).toHaveBeenCalledTimes(1);
  });
});
