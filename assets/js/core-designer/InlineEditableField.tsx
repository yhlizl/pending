import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

// Custom hook to track a previous value.
// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePrevious = <T extends unknown>(newValue: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = newValue;
  });
  return ref.current;
};

// Styled component classes that can be targeted by parent styles using
// descendant selectors.

export const NonEditingStyle = styled.span``;

export const EditingStyle = styled.input``;

// Types

type InlineEditableFieldProps = {
  value: string;
  onChange: (newValue: string) => void;
};

/** An inline-editable text field.
 *
 * When inactive, it looks like plain text, but when activated, it functions
 * like a text input. The onChange handler is only called after the input is
 * blurred.
 */
const InlineEditableField = ({ value, onChange }: InlineEditableFieldProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const previousIsEditing = usePrevious(isEditing);

  useEffect(() => {
    // Focus and select all the text only on the initial transition from not
    // editing to editing.
    if (!previousIsEditing && isEditing) {
      ref.current?.select();
    }
  }, [isEditing, previousIsEditing]);

  if (isEditing) {
    return (
      <EditingStyle
        defaultValue={value}
        onBlur={() => {
          onChange(ref.current!.value);
          setIsEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onChange(ref.current!.value);
            setIsEditing(false);
          }
        }}
        ref={ref}
      />
    );
  }
  return (
    <NonEditingStyle
      onClick={() => setIsEditing(true)}
      onFocus={() => setIsEditing(true)}
      onKeyDown={(e) => {
        if (e.key === "Enter") setIsEditing(true);
      }}
      role="textbox"
      tabIndex={0}
    >
      {value}
    </NonEditingStyle>
  );
};

export default InlineEditableField;
