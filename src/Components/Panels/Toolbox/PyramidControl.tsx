import React from 'react';

import { IPyramid } from '../../../Document/Obstacles/Pyramid';

import styles from './PyramidControl.module.scss';

interface Props {
	data: IPyramid;
	onChange: (changes: IPyramid) => void;
}

const PyramidControl = ({ data, onChange }: Props) => {
	const handleFlipZOnChange = () => {
		onChange({
			...data,
			flipz: !data.flipz,
		});
	};

	return (
		<section>
			<fieldset>
				<legend className={styles.legend}>Pyramid</legend>
				<div>
					<label className="fw-normal">
						<input
							className={styles.checkbox}
							type="checkbox"
							checked={data.flipz}
							onChange={handleFlipZOnChange}
						/>
						Flip Z Axis
					</label>
				</div>
			</fieldset>
		</section>
	);
};

export default PyramidControl;
