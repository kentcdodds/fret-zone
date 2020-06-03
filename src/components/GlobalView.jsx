import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectTrack,
  selectedTrackNumberSelector,
  selectMeasure,
  selectedMeasureNumberSelector,
  selectDuration,
} from '../slices/ui';
import {
  tracksSelector,
  measuresSelector,
  durationsSelector,
} from '../slices/document';

import './GlobalView.scss';

const GlobalView = ({ openAddTrackModal }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  const renderTrackControls = () =>
    tracks.map((track, trackNumber) => (
      <TrackControl track={track} trackNumber={trackNumber} key={trackNumber} />
    ));

  const renderMeasureTable = () =>
    tracks.map((track, TrackNumber) => (
      <MeasureTableRow
        track={track}
        trackNumber={TrackNumber}
        key={TrackNumber}
      />
    ));

  return (
    <div className="GlobalView">
      <div className="TrackControls">
        <div className="TrackControls__Header">
          <button
            className="TrackControls__Button--AddTrack"
            title="Add Track"
            onClick={openAddTrackModal}
          >
            +
          </button>
          <span className="TrackControls__Heading">Tracks</span>
        </div>
        {renderTrackControls()}
        <div className="TrackControls__Footer">
          <span className="TrackControls__Heading">Master</span>
        </div>
      </div>
      <div className="MeasureTable">
        <div className="MeasureTable__Header">
          {tracks.length
            ? tracks[selectedTrackNumber].measures.map(
                (measureId, measureNumber) => {
                  let measureNumberClassName = 'MeasureTable__MeasureNumber';

                  // TODO Refactor using classnames utility
                  if (measureNumber === selectedMeasureNumber) {
                    measureNumberClassName += ` ${measureNumberClassName}--IsSelected`;
                  }

                  return (
                    <div
                      className={measureNumberClassName}
                      onClick={() => {
                        dispatch(selectMeasure(measureNumber));
                        dispatch(
                          selectDuration(
                            measures.find((measure) => measure.id === measureId)
                              .durations[0]
                          )
                        );
                      }}
                      key={measureNumber}
                    >
                      {measureNumber + 1}
                    </div>
                  );
                }
              )
            : null}
        </div>
        {renderMeasureTable()}
        <div className="MeasureTable__Footer">
          {/* TODO Show section names */}
        </div>
      </div>
    </div>
  );
};

const TrackControl = ({ track, trackNumber }) => {
  const dispatch = useDispatch();
  const tracks = useSelector(tracksSelector);
  const measures = useSelector(measuresSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  let trackControlClassName = 'TrackControl';

  // TODO Refactor using classnames utility
  if (trackNumber === selectedTrackNumber) {
    trackControlClassName += ` ${trackControlClassName}--IsActive`;
  }

  return (
    <div
      className={trackControlClassName}
      onClick={() => {
        dispatch(selectTrack(trackNumber));

        // Select first duration of track's measure at selectedMeasureNumber
        dispatch(
          selectDuration(
            measures.find(
              (measure) =>
                measure.id ===
                tracks[trackNumber].measures[selectedMeasureNumber]
            ).durations[0]
          )
        );
      }}
    >
      <div className="TrackControl__ColorTab"></div>
      <span className="TrackControl__TrackNumber">{trackNumber + 1}.</span>
      {track.fullName}
    </div>
  );
};

const MeasureTableRow = ({ track, trackNumber }) => (
  <div className="MeasureTable__Row">
    {track.measures.map((measureId, measureNumber) => (
      <MeasureTableCell
        measureId={measureId}
        measureNumber={measureNumber}
        trackNumber={trackNumber}
        key={measureId}
      />
    ))}
  </div>
);

const MeasureTableCell = ({ measureId, measureNumber, trackNumber }) => {
  const dispatch = useDispatch();
  const measures = useSelector(measuresSelector);
  const durations = useSelector(durationsSelector);
  const selectedTrackNumber = useSelector(selectedTrackNumberSelector);
  const selectedMeasureNumber = useSelector(selectedMeasureNumberSelector);

  const getMeasure = () => measures.find((measure) => measure.id === measureId);

  const cellBaseClassName = 'MeasureTable__Cell';
  let cellClassName = cellBaseClassName;

  // TODO Refactor using classnames utility
  if (
    trackNumber === selectedTrackNumber &&
    measureNumber === selectedMeasureNumber
  ) {
    cellClassName += ` ${cellBaseClassName}--IsSelected`;
  }

  if (
    getMeasure().durations.every((durationId) => {
      const thisDuration = durations.find(
        (duration) => duration.id === durationId
      );

      return thisDuration.isRest || !thisDuration.notes.length;
    })
  ) {
    cellClassName += ` ${cellBaseClassName}--Empty`;
  }

  return (
    <div
      className={cellClassName}
      onClick={() => {
        dispatch(selectTrack(trackNumber));
        dispatch(selectMeasure(measureNumber));
        dispatch(selectDuration(getMeasure().durations[0]));
      }}
    ></div>
  );
};

export default GlobalView;
