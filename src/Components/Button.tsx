import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from '@fortawesome/react-fontawesome';
import React, { forwardRef, HTMLProps, ReactNode } from 'react';

import { classList } from '../Utilities/cssClasses';

import a11yPatterns from '../sass/a11yPatterns.module.scss';
import styles from './Button.module.scss';

export type ButtonType = 'default' | 'info' | 'success' | 'warning' | 'danger';

export type ButtonModifier = 'none';

type Blacklist = 'onClick' | 'type';
type BaseProps = Omit<HTMLProps<HTMLButtonElement>, Blacklist>;

interface Props extends BaseProps {
  /**
   * The type of action this button will perform. Different types will use
   * different colors.
   */
  type: ButtonType;

  /**
   * Modify the appearance of the button.
   */
  modifier?: ButtonModifier;

  /**
   * A FontAwesome icon.
   */
  icon?: FontAwesomeIconProps['icon'];

  /**
   * Disable the button and add a spinner icon to indicate that an operation
   * related to this button is in progress.
   */
  isLoading?: boolean;

  /**
   * The action to perform when the button is clicked.
   *
   * @param event The original MouseEvent of this click event
   * @param type The type of button
   */
  onClick: (event: React.MouseEvent, type: ButtonType) => void;

  /**
   * When `isLoading` set to true, the contents of the button will be replaced
   * with the return value of this callback.
   */
  onLoading?: () => ReactNode;

  /**
   * This component supports composition.
   */
  children: ReactNode;
}

const a11yPatternClasses: Partial<Record<ButtonType, string>> = {
  warning: a11yPatterns.patternDiamonds,
  danger: a11yPatterns.patternUpwardStripes,
};

const modifierClasses: Record<ButtonModifier, string> = {
  none: styles.none,
};

const typeClasses: Record<ButtonType, string> = {
  default: styles.styleDefault,
  success: styles.styleSuccess,
  info: styles.styleInfo,
  warning: styles.styleWarning,
  danger: styles.styleDanger,
};

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      icon,
      type = 'default',
      modifier = 'none',
      isLoading,
      onClick,
      onLoading,
      children,
      className,
      disabled,
      ...props
    },
    ref,
  ) => {
    const onHandleClick = (event: React.MouseEvent) => onClick(event, type);
    const classes = [
      styles.button,
      className,
      a11yPatternClasses[type],
      typeClasses[type],
      modifierClasses[modifier],
    ];
    const hasIcon = icon != null || isLoading;

    return (
      <button
        {...props}
        ref={ref}
        className={classList(classes)}
        onClick={onHandleClick}
        disabled={isLoading ?? disabled}
      >
        {hasIcon && (
          <span className="me-1 ms-n1">
            {isLoading ? (
              <FontAwesomeIcon fixedWidth={true} icon={faSpinner} spin={true} />
            ) : (
              <FontAwesomeIcon fixedWidth={true} icon={icon!} />
            )}
          </span>
        )}
        {(isLoading && onLoading?.()) || children}
      </button>
    );
  },
);

export default Button;
export type { Props as IButtonProps };
