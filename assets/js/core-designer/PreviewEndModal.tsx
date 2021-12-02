import React from "react";
import Modal from "components/Modal";
import * as URLs from "api/URLs";
import {
  ModalContainer,
  Title,
  Body,
  ActionRow,
  VerticallySpaced,
  ModalPrimaryButton,
} from "components/Modal/ModalStyles";

type PreviewEndModalProps = {
  isOpen: boolean;
  onRequestClose: () => void;
  onContactSales: () => void;
  designName: string;
};

const PreviewEndModal = ({
  isOpen,
  onRequestClose,
  onContactSales,
  designName,
}: PreviewEndModalProps) => {
  return (
    <Modal ariaHideApp={false} isOpen={isOpen} onRequestClose={onRequestClose}>
      <ModalContainer>
        <Title onClickCloseButton={onRequestClose}>
          SiFive Core Designer Preview
        </Title>
        <Body>
          <VerticallySpaced>
            <p>Thanks for using the Core Designer Preview.</p>
            <p>
              The <b>{designName}</b> design has been saved in your{" "}
              <a href={URLs.workspace}>Workspace</a>.
            </p>
            <p>Interested in this core? It&apos;s available now.</p>
            <ActionRow>
              <ModalPrimaryButton as="button" onClick={onContactSales}>
                Contact Sales
              </ModalPrimaryButton>
            </ActionRow>
          </VerticallySpaced>
        </Body>
      </ModalContainer>
    </Modal>
  );
};

export default PreviewEndModal;
