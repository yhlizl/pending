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

// ========================================================================== //
//                                                                            //
//                               Main Component                               //
//                                                                            //
// ========================================================================== //

const UnsupportedKnobsModal = ({
  changedKnobs,
  isOpen,
  knobMap,
  onRequestClose,
}) => {
  const { updated_knob_values, removed_keys } = changedKnobs;
  const showUpdatedKnobValues =
    updated_knob_values && Object.keys(updated_knob_values).length > 0;

  return (
    <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalContainer>
        <Title onClickCloseButton={onRequestClose}>Unsupported Values</Title>

        <Body>
          {showUpdatedKnobValues ? (
            <ChangedValuesMessage
              changedKnobs={updated_knob_values}
              knobMap={knobMap}
              removedKeys={removed_keys}
            />
          ) : (
            <UnsupportedKeysMessage />
          )}
          <ActionRow>
            <ModalPrimaryButton as="button" onClick={onRequestClose}>
              Continue
            </ModalPrimaryButton>
          </ActionRow>
        </Body>
      </ModalContainer>
    </Modal>
  );
};

export default UnsupportedKnobsModal;

UnsupportedKnobsModal.propTypes = {
  // Disabling because changedKnobs can be an object with unpredictable keys
  // eslint-disable-next-line react/forbid-prop-types
  changedKnobs: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  knobMap: PropTypes.instanceOf(Map),
  onRequestClose: PropTypes.func.isRequired,
};

UnsupportedKnobsModal.defaultProps = {
  knobMap: {},
};

// ========================================================================== //
//                                                                            //
//                               Sub-Components                               //
//                                                                            //
// ========================================================================== //

const ChangedValuesMessage = ({ changedKnobs, knobMap, removedKeys }) => (
  <>
    {removedKeys ? (
      <p>
        This Core Design contained settings that are no longer supported in Core
        Designer. Those values have been modified or removed.
      </p>
    ) : (
      <p>
        This Core Design contained settings that are no longer supported in Core
        Designer.
      </p>
    )}
    <p>The following settings have been modified in your Core Design:</p>
    <Divider />
    <ChangedValues changedKnobs={changedKnobs} knobMap={knobMap} />
  </>
);

ChangedValuesMessage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  changedKnobs: PropTypes.object.isRequired,
  knobMap: PropTypes.instanceOf(Map).isRequired,
  removedKeys: PropTypes.bool.isRequired,
};

const ChangedValues = ({ changedKnobs, knobMap }) => {
  const knobs = Object.entries(changedKnobs);
  return (
    <UpdatedKnobsList>
      {knobs.map(([internalName, knobValue]) => (
        <li key={internalName}>
          <strong>{getKnobReviewName(internalName, knobMap)}</strong> is now{" "}
          {knobValue}.
        </li>
      ))}
    </UpdatedKnobsList>
  );
};

ChangedValues.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  changedKnobs: PropTypes.object.isRequired,
  knobMap: PropTypes.instanceOf(Map).isRequired,
};

const UnsupportedKeysMessage = () => (
  <p>
    This Core Design contained settings that are no longer supported in Core
    Designer. Those values have been modified or removed.
  </p>
);
