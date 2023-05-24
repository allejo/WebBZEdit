import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';
import FocusLock from 'react-focus-lock';

import {
  ColorLiteral,
  ColorTuple,
  getColorName,
} from '../Document/Utilities/Colors';
import { classList } from '../Utilities/cssClasses';
import { ColorsSorted } from '../data/colors';
import TextField from './Form/TextField';

import styles from './ColorPicker.module.scss';

interface ColorPreviewProps {
  color: ColorTuple;
  literal: ColorLiteral;
  onClick?: (color: ColorTuple, literal: ColorLiteral) => void;
}

const ColorPreview = ({ color, literal, onClick }: ColorPreviewProps) => {
  const Tag = onClick ? 'button' : 'div';
  const handleOnClick = useCallback(() => onClick?.(color, literal), [
    onClick,
    color,
    literal,
  ]);

  return (
    <Tag
      className={styles.colorSelectorButton}
      onClick={handleOnClick}
      title={literal}
      style={{ backgroundColor: `rgb(${color.join(',')})` }}
    ></Tag>
  );
};

const hexToRgb = (hex: string): ColorTuple | null => {
  const regexChunks = hex
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (m, r, g, b) => '#' + r + r + g + g + b + b,
    )
    .substring(1)
    .match(/.{2}/g);

  if (regexChunks === null) {
    return null;
  }

  const rgb = regexChunks.map((x) => parseInt(x, 16));

  return (rgb as any) as ColorTuple;
};

enum SelectionMethod {
  None,
  WithLiteral,
  WithTuple,
}

interface Props {}

const ColorPicker = () => {
  const colorInput = useRef<HTMLInputElement>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [fieldText, setFieldText] = useState<string>('');
  const [method, setMethod] = useState<SelectionMethod>(SelectionMethod.None);

  const [selectedTuple, setSelectedTuple] = useState<ColorTuple | null>(null);

  const closeColorPanel = useCallback(() => setPanelOpen(false), []);
  const toggleColorPanel = useCallback(() => setPanelOpen((open) => !open), []);

  const handleBuiltInColorSelected = useCallback(
    (color: ColorTuple, literal: ColorLiteral) => {
      setPanelOpen(false);
      setSelectedTuple(color);
      setMethod(SelectionMethod.WithLiteral);
      setFieldText(getColorName(literal) ?? '');
    },
    [],
  );
  const handleColorPickerSelected = useCallback(
    (event: SyntheticEvent<HTMLInputElement>) => {
      const hex = event.currentTarget.value;

      setPanelOpen(false);
      setMethod(SelectionMethod.WithTuple);
      setSelectedTuple(hexToRgb(hex));
      setFieldText(hex);
    },
    [],
  );

  const handleColorSelectorTrigger = useCallback(() => {
    colorInput.current?.click();
  }, []);

  const usingBuiltInColor = method === SelectionMethod.WithLiteral;

  return (
    <div className={styles.componentContainer}>
      <div className={styles.fieldWrapper}>
        <TextField
          className={classList([[styles.textFieldStylized, usingBuiltInColor]])}
          label="Color"
          onChange={setFieldText}
          onKeyDown={closeColorPanel}
          onFocus={closeColorPanel}
          value={fieldText}
          hideLabel={true}
        />
        <button onClick={toggleColorPanel}>
          <ColorPreview
            color={selectedTuple ?? [255, 255, 255]}
            literal="White"
          />
        </button>
      </div>
      {panelOpen && (
        <FocusLock>
          <div>
            <button onClick={handleColorSelectorTrigger}>Choose a color</button>
            <input
              type="color"
              ref={colorInput}
              className="sr-only"
              onChange={handleColorPickerSelected}
            />
          </div>
          <div className={styles.colorDropdown}>
            {Array.from(ColorsSorted.entries(), ([literal, color]) => (
              <ColorPreview
                color={color}
                literal={literal}
                onClick={handleBuiltInColorSelected}
              />
            ))}
          </div>
        </FocusLock>
      )}
    </div>
  );
};

export default ColorPicker;
export type { Props as IColorPickerProps };
