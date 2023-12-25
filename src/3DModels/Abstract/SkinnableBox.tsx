import { ThreeEvent } from '@react-three/fiber';
import React from 'react';
import { MeshBasicMaterial, Texture } from 'three';

import { useHighlightableEdges } from '../../hooks/useHighlightableEdges';
import { Vector3F } from '../../Utilities/contracts';
import {
	assertEveryIsNotNull,
	isDevEnv,
} from '../../Utilities/developmentUtilities';
import { deg2rad } from '../../Utilities/math';

export type MaterialParams = ConstructorParameters<typeof MeshBasicMaterial>[0];

interface Props {
	position: Vector3F;
	size: Vector3F;
	rotation: number;
	onClick?: (e: MouseEvent) => void;
	isSelected?: boolean;
	isSelectable?: boolean;
	renderOrder?: number;
	renderTransparency?: boolean;
	topMaterial?: MaterialParams | null;
	botMaterial?: MaterialParams | null;
	xPosMaterial?: MaterialParams | null;
	xNegMaterial?: MaterialParams | null;
	yPosMaterial?: MaterialParams | null;
	yNegMaterial?: MaterialParams | null;
	topTexture?: Texture | null;
	botTexture?: Texture | null;
	xPosTexture?: Texture | null;
	xNegTexture?: Texture | null;
	yPosTexture?: Texture | null;
	yNegTexture?: Texture | null;
}

function faceProps(
	materialParams: MaterialParams | null | undefined,
	texture: Texture | null | undefined,
	fallback: Partial<MaterialParams>,
): Partial<MaterialParams> {
	if (materialParams != null) {
		return materialParams;
	}

	if (texture != null) {
		return { map: texture };
	}

	return fallback;
}

const SkinnableBox = ({
	position: [bzwPosX, bzwPosY, bzwPosZ],
	size: [bzwSizeX, bzwSizeY, bzwSizeZ],
	rotation,
	onClick,
	topMaterial,
	botMaterial,
	xPosMaterial,
	xNegMaterial,
	yPosMaterial,
	yNegMaterial,
	topTexture,
	botTexture,
	xPosTexture,
	xNegTexture,
	yPosTexture,
	yNegTexture,
	isSelected = false,
	isSelectable = true,
	renderOrder = 0,
	renderTransparency = false,
}: Props) => {
	// We only need this expensive check in development while we're building out
	// objects.
	if (isDevEnv()) {
		assertEveryIsNotNull(
			[topMaterial, topTexture],
			'You should not define both a topMaterial and a topTexture',
		);
		assertEveryIsNotNull(
			[botMaterial, botTexture],
			'You should not define both a botMaterial and a botTexture',
		);
		assertEveryIsNotNull(
			[xPosMaterial, xPosTexture],
			'You should not define both a xPosMaterial and a xPosTexture',
		);
		assertEveryIsNotNull(
			[xNegMaterial, xNegTexture],
			'You should not define both a xNegMaterial and a xNegTexture',
		);
		assertEveryIsNotNull(
			[yPosMaterial, yPosTexture],
			'You should not define both a yPosMaterial and a yPosTexture',
		);
		assertEveryIsNotNull(
			[yNegMaterial, yNegTexture],
			'You should not define both a yNegMaterial and a yNegTexture',
		);
	}

	const highlightableEdges = useHighlightableEdges();
	const isHighlighted =
		isSelectable && (highlightableEdges.isHovered || isSelected);

	const handleOnClick = (e: ThreeEvent<MouseEvent>) => {
		e.stopPropagation();
		onClick?.(e);
	};

	// If any of our faces are not configured, then we must force our box to
	// support transparency.
	const forceTransparency =
		(yPosMaterial == null && yPosTexture == null) ||
		(yNegMaterial == null && yNegTexture == null) ||
		(topMaterial == null && topTexture == null) ||
		(botMaterial == null && botTexture == null) ||
		(xPosMaterial == null && xPosTexture == null) ||
		(xNegMaterial == null && xNegTexture == null) ||
		false;
	const invisibleMaterial = {
		color: 0xffffff,
		opacity: 0,
		transparent: true,
	};
	const standardProps = {
		attachArray: 'material',
		transparent: forceTransparency || renderTransparency,
	};

	const yPosMatProps = faceProps(yPosMaterial, yPosTexture, invisibleMaterial);
	const yNegMatProps = faceProps(yNegMaterial, yNegTexture, invisibleMaterial);
	const topMatProps = faceProps(topMaterial, topTexture, invisibleMaterial);
	const botMatProps = faceProps(botMaterial, botTexture, invisibleMaterial);
	const xPosMatProps = faceProps(xPosMaterial, xPosTexture, invisibleMaterial);
	const xNegMatProps = faceProps(xNegMaterial, xNegTexture, invisibleMaterial);

	return (
		<mesh
			ref={highlightableEdges.meshRef}
			{...highlightableEdges.meshProps}
			position={[bzwPosX, bzwPosZ + bzwSizeZ / 2, -bzwPosY]}
			rotation={[0, deg2rad(rotation), 0]}
			onClick={handleOnClick}
			renderOrder={renderOrder}
		>
			<boxBufferGeometry args={[bzwSizeX * 2, bzwSizeZ, bzwSizeY * 2]} />
			{/* === Materials === */}
			<meshBasicMaterial {...standardProps} {...yPosMatProps} /> {/* +y */}
			<meshBasicMaterial {...standardProps} {...yNegMatProps} /> {/* -y */}
			<meshBasicMaterial {...standardProps} {...topMatProps} /> {/* +z */}
			<meshBasicMaterial {...standardProps} {...botMatProps} /> {/* -z */}
			<meshBasicMaterial {...standardProps} {...xPosMatProps} /> {/* +x */}
			<meshBasicMaterial {...standardProps} {...xNegMatProps} /> {/* -x */}
			{/* === Edges Highlighting === */}
			{highlightableEdges.jsxHighlight({ isHighlighted })}
		</mesh>
	);
};

export default SkinnableBox;
