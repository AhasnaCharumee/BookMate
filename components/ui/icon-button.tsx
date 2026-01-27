import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, View } from 'react-native';
import { IconSymbol, IconSymbolName } from './icon-symbol';

export interface IconButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  /** Icon name from the icon mapping */
  icon: IconSymbolName;
  /** Icon size (default: 24) */
  size?: number;
  /** Icon color */
  color?: string;
  /** Button background color */
  backgroundColor?: string;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Additional styling for the container */
  containerClassName?: string;
}

/**
 * Reusable icon button component
 * Used for actions, headers, and navigation
 */
export function IconButton({
  icon,
  size = 24,
  color = 'white',
  backgroundColor,
  disabled = false,
  containerClassName = '',
  style,
  ...props
}: IconButtonProps) {
  const opacity = disabled ? 0.5 : 1;

  return (
    <TouchableOpacity
      disabled={disabled}
      style={[{ opacity }, style]}
      {...props}
    >
      <View
        className={containerClassName}
        style={backgroundColor ? { backgroundColor } : undefined}
      >
        <IconSymbol name={icon} size={size} color={color} />
      </View>
    </TouchableOpacity>
  );
}
