import * as React from "react";
import PropTypes from "prop-types";
import Modal from "components/Modal";

import {
  ModalContainer,
  Body,
  Title,
  Divider,
  ModalPrimaryButton,
  ActionRow,
  UpdatedKnobsList,
} from "components/Modal/ModalStyles";

// ========================================================================== //
//                                                                            //
//                                   Helpers                                  //
//                                                                            //
// ========================================================================== //

const getKnobReviewName = (internalName, knobMap) => {
  const knob = knobMap.get(internalName);
  return knob.reviewName;
};

const formatAndSortKnobs = (knobs, knobMap) => {
  const formattedKnobs = knobs.map((internalName) =>
    getKnobReviewName(internalName, knobMap)
  );
  return formattedKnobs.sort();
};

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const NewKnobsModal = ({
  newKnobs,
  isOpen,
  onRequestClose,
  series,
  knobMap,
}) => (
  <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose}>
    <ModalContainer>
      <Title onClickCloseButton={onRequestClose}>New Settings</Title>

      <Body>
        <>
          <p>
            Since you last opened this Core Design, new options have been added
            to the {series} Series.
          </p>
          <p>Your Core Design now has the following configurable settings:</p>
          <Divider />
          <NewKnobs newKnobs={newKnobs} knobMap={knobMap} />
        </>
        <ActionRow>
          <ModalPrimaryButton as="button" onClick={onRequestClose}>
            Continue
          </ModalPrimaryButton>
        </ActionRow>
      </Body>
    </ModalContainer>
  </Modal>
);

export default NewKnobsModal;

NewKnobsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  knobMap: PropTypes.instanceOf(Map),
  newKnobs: PropTypes.arrayOf(PropTypes.string),
  onRequestClose: PropTypes.func.isRequired,
  series: PropTypes.string.isRequired,
};

NewKnobsModal.defaultProps = {
  knobMap: {},
  newKnobs: [],
};

// ========================================================================== //
//                                                                            //
//                               Sub-Components                               //
//                                                                            //
// ========================================================================== //

const NewKnobs = ({ newKnobs, knobMap }) => {
  const knobs = formatAndSortKnobs(newKnobs, knobMap);
  return (
    <UpdatedKnobsList>
      {knobs.map((internalName) => (
        <li key={internalName}>
          <strong>{internalName}</strong>
        </li>
      ))}
    </UpdatedKnobsList>
  );
};

NewKnobs.propTypes = {
  knobMap: PropTypes.instanceOf(Map).isRequired,
  newKnobs: PropTypes.arrayOf(PropTypes.string).isRequired,
};
