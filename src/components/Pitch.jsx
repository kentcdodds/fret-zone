import React from 'react';
import clsx from 'clsx';

import './Pitch.scss';

// Scientific pitch notation for a given pitch
const Pitch = ({ note, octave, isNotePresent }) => {
  const baseClassName = 'Pitch';

  return (
    <label
      className={clsx(
        baseClassName,
        // Explicitly checking if false here, because we don't want the modifier class if isNotePresent prop is undefined
        isNotePresent === false && `${baseClassName}--IsOpenString`
      )}
    >
      {note}
      <sub className="Pitch__Octave">{octave}</sub>
    </label>
  );
};

export default Pitch;
