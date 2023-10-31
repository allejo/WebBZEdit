import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPopper, Instance } from '@popperjs/core';
import React, { KeyboardEvent, useCallback, useEffect, useRef } from 'react';

import { useStateWithCallback } from '../hooks/useStateWithCallback';
import { isDevEnv } from '../Utilities/developmentUtilities';
import keyboard from '../Utilities/keyboard';

import styles from './ToggleTip.module.scss';

interface Props {
	/**
	 * A description of the "toggle tip" that will be shown to screen readers.
	 */
	label?: string;

	/**
	 * The content that will be displayed when this "toggle tip" is clicked on.
	 */
	content: string;

	/**
	 * The default relative location the message will be displayed at. If the
	 * message does not fit within the current viewport, it will be moved
	 * automatically.
	 */
	location?: 'top' | 'right' | 'bottom' | 'left';
}

const ToggleTip = ({
	label = 'More information',
	content,
	location = 'top',
}: Props) => {
	const [showTip, setShowTip] = useStateWithCallback(false);

	const timeout = useRef<number>(-1);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const bubbleRef = useRef<HTMLSpanElement>(null);
	const arrowRef = useRef<HTMLDivElement>(null);

	const popperRef = useRef<Instance>();

	const handleButtonClick = () => {
		setShowTip(false, () => {
			timeout.current = window.setTimeout(() => {
				setShowTip(true);
			}, 100);
		});
	};
	const handleButtonKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.key === keyboard.ESC) {
			setShowTip(false);
		}
	};
	const handleDomClick = useCallback(
		(event: MouseEvent) => {
			if (buttonRef.current !== event.target) {
				setShowTip(false);
			}
		},
		[setShowTip],
	);

	useEffect(() => {
		document.addEventListener('click', handleDomClick);

		popperRef.current = createPopper(buttonRef.current!, bubbleRef.current!, {
			placement: location,
			modifiers: [
				{
					name: 'arrow',
					options: {
						element: arrowRef.current!,
						padding: 5,
					},
				},
				{
					name: 'offset',
					options: {
						offset: [0, 10],
					},
				},
			],
		});

		return () => {
			window.clearTimeout(timeout.current);
			document.removeEventListener('click', handleDomClick);
			popperRef.current?.destroy();
		};
	}, [location, handleDomClick]);

	popperRef.current?.update();

	const bubbleStyles: object = {
		...popperRef.current?.state.styles['popper'],
		display: showTip ? 'inline' : 'none',
	};
	const arrowStyles: object = {
		...popperRef.current?.state.styles['arrow'],
		display: showTip ? 'inline' : 'none',
	};

	if (isDevEnv()) {
		if (/<br\s*\/?>/gm.test(content)) {
			console.warn(
				'The content for this ToggleTip uses an HTML break tag. If you want a line break, use \\n instead.',
				`Content: "${content}"`,
			);
		}
	}

	return (
		<span className={styles.container}>
			<button
				aria-label={label}
				className={styles.toggletip}
				onClick={handleButtonClick}
				onKeyDown={handleButtonKeyDown}
				ref={buttonRef}
				type="button"
			>
				<FontAwesomeIcon icon={faInfoCircle} />
			</button>

			<span
				aria-live="polite"
				className={styles.bubble}
				ref={bubbleRef}
				role="status"
				style={bubbleStyles}
			>
				{(!popperRef.current || showTip) && (
					<>
						<span className={styles.message}>
							{content.split('\n').map((msg: string) => (
								<span key={msg}>{msg}</span>
							))}
						</span>
					</>
				)}
				<span className={styles.arrow} ref={arrowRef} style={arrowStyles} />
			</span>
		</span>
	);
};

export default ToggleTip;
export type { Props as IToggleTipProps };
