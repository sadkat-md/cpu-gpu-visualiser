"use client";

import { Billboard, Text } from "@react-three/drei";

export function HoloLabel({
  text,
  position,
  color,
  size = 0.16,
  opacity = 1,
}: {
  text: string;
  position: [number, number, number];
  color: string;
  size?: number;
  opacity?: number;
}) {
  return (
    <Billboard position={position} follow>
      <Text
        fontSize={size}
        color={color}
        fillOpacity={opacity}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.014}
        outlineColor="#02060c"
        outlineOpacity={0.9}
        letterSpacing={0.06}
        maxWidth={3.4}
        textAlign="center"
      >
        {text}
      </Text>
    </Billboard>
  );
}
