import React from 'react';
import {
  render,
  fireEvent,
  screen,
  getByText,
  getByLabelText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import App from '../App';

describe('AddTrackModal', () => {
  it(`can be opened by clicking the '+' button in GlobalView`, () => {
    render(<App />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Add Track'));

    expect(
      getByText(screen.getByRole('dialog'), 'Add Track')
    ).toBeInTheDocument();
  });

  it('creates a new track on confirm', () => {
    const { container } = render(<App />);

    expect(container.querySelector('.TrackControl')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTitle('Add Track'));

    const firstInput = getByLabelText(
      screen.getByRole('dialog'),
      'Clean Guitar',
      { exact: false }
    );

    expect(firstInput).toHaveFocus();

    fireEvent.keyDown(firstInput, { key: 'Enter' });

    expect(container.querySelector('.TrackControl')).toBeInTheDocument();
  });
});
