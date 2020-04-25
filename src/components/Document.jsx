import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectedTrackNumberSelector,
  // selectTrack,
  selectedMeasureNumberSelector,
  selectMeasure,
  selectedStringNumberSelector,
  selectString,
  // selectedNoteNumberSelector,
  // selectNote,
} from '../slices/ui';
import { measuresSelector, tracksSelector } from '../slices/document';

import './Document.scss';

const Document = ({ documentTitle, documentArtist }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);
  const selectedStringNumber = useSelector(selectedStringNumberSelector);
  // const selectedNoteNumber = useSelector(selectedNoteNumberSelector);

  const renderSelectedTrackNotation = () => {
    const selectedTrack = tracks[selectedTrackNumber];

    if (tracks.length && measures.length) {
      const measuresInSelectedTrack = selectedTrack.measures.map((measureId) =>
        measures.find((someMeasure) => someMeasure.id === measureId)
      );

      return (
        <div className="TrackNotation">
          <span className="TrackNotation__TrackName--Abbreviated">
            {selectedTrack.abbreviatedName}
          </span>
          {measuresInSelectedTrack.map((measure, measureNumber) => (
            <div className="Measure" key={measureNumber}>
              {selectedTrack.tuning.map((stringTuning, stringNumber) => {
                let inputClassname = 'Measure__Input';

                // TODO Refactor using classnames utility
                if (
                  measureNumber === selectedMeasureNumber &&
                  stringNumber === selectedStringNumber
                ) {
                  inputClassname += ` ${inputClassname}--IsActive`;
                }

                return (
                  <input
                    className={inputClassname}
                    type="text"
                    value="-"
                    onClick={() => {
                      dispatch(selectMeasure(measureNumber));
                      dispatch(selectString(stringNumber));
                    }}
                    onChange={(event) => {
                      console.log('you typed a number:', event.target.value);
                    }}
                    key={stringNumber}
                  />
                );
              })}
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="Document">
      <div className="Document__Page">
        {documentTitle && <h1 className="Document__Title">{documentTitle}</h1>}
        {documentArtist && (
          <h2 className="Document__Artist">{documentArtist}</h2>
        )}
        {renderSelectedTrackNotation()}
      </div>
    </div>
  );
};

export default Document;
