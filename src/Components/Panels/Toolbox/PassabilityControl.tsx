import React from 'react';

import { IPassableObject } from '../../../Document/Attributes/IPassableObject';

import styles from './PassabilityControl.module.scss';

interface Props {
	data: IPassableObject;
	onChange: (changes: IPassableObject) => void;
}

const PassabilityControl = ({ data, onChange }: Props) => {
	const handleDriveThroughOnChange = () => {
		onChange({
			...data,
			drivethrough: !data.drivethrough,
		});
	};
	const handleShootThroughOnChange = () => {
		onChange({
			...data,
			shootthrough: !data.shootthrough,
		});
	};

	return (
		<section>
			<fieldset>
				<legend className={styles.legend}>Passability</legend>
				<div>
					<label className="fw-normal">
						<input
							className={styles.checkbox}
							type="checkbox"
							checked={data.drivethrough}
							onChange={handleDriveThroughOnChange}
						/>
						Drive Through
					</label>
				</div>

				<div>
					<label className="fw-normal">
						<input
							className={styles.checkbox}
							type="checkbox"
							checked={data.shootthrough}
							onChange={handleShootThroughOnChange}
						/>
						Shoot Through
					</label>
				</div>
			</fieldset>
		</section>
	);
};

export default PassabilityControl;
