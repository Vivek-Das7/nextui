import type {ChipVariantProps, ChipSlots, SlotsToClasses} from "@nextui-org/theme";
import type {ReactNode} from "react";

import {HTMLNextUIProps, mapPropsVariants, PropGetter} from "@nextui-org/system";
import {mergeProps} from "@react-aria/utils";
import {usePress} from "@react-aria/interactions";
import {useFocusRing} from "@react-aria/focus";
import {chip} from "@nextui-org/theme";
import {useDOMRef} from "@nextui-org/dom-utils";
import {clsx, ReactRef} from "@nextui-org/shared-utils";
import {useMemo, isValidElement, cloneElement} from "react";
import {PressEvent} from "@react-types/shared";

export interface UseChipProps extends HTMLNextUIProps<"div">, ChipVariantProps {
  /**
   * Ref to the DOM node.
   */
  ref?: ReactRef<HTMLDivElement | null>;
  /**
   * Avatar to be rendered in the left side of the chip.
   */
  avatar?: React.ReactNode;
  /**
   * Element to be rendered in the left side of the chip.
   * this props overrides the `avatar` prop.
   */
  leftContent?: React.ReactNode;
  /**
   * Element to be rendered in the right side of the chip.
   */
  rightContent?: React.ReactNode;
  /**
   * Classname or List of classes to change the styles of the element.
   * if `className` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <Chip styles={{
   *    base:"base-classes",
   *    dot: "dot-classes",
   *    content: "content-classes",
   *    avatar: "avatar-classes",
   *    closeButton: "close-button-classes",
   * }} />
   * ```
   */
  styles?: SlotsToClasses<ChipSlots>;
  /**
   * Callback fired when the chip is closed. if you pass this prop,
   * the chip will display a close button (rightContent).
   * @param e PressEvent
   */
  onClose?: (e: PressEvent) => void;
}

export function useChip(originalProps: UseChipProps) {
  const [props, variantProps] = mapPropsVariants(originalProps, chip.variantKeys);

  const {
    ref,
    as,
    children,
    avatar,
    leftContent,
    rightContent,
    onClose,
    styles,
    className,
    ...otherProps
  } = props;

  const Component = as || "div";

  const domRef = useDOMRef(ref);

  const baseStyles = clsx(styles?.base, className);

  const isCloseable = !!onClose;
  const isDotVariant = originalProps.variant === "dot";

  const {focusProps: closeFocusProps, isFocusVisible: isCloseButtonFocusVisible} = useFocusRing();

  const isOneChar = useMemo(
    () => typeof children === "string" && children?.length === 1,
    [children],
  );

  const hasLeftContent = useMemo(() => !!avatar || !!leftContent, [avatar, leftContent]);
  const hasRightContent = useMemo(() => !!rightContent || isCloseable, [rightContent, isCloseable]);

  const slots = useMemo(
    () =>
      chip({
        ...variantProps,
        hasLeftContent,
        hasRightContent,
        isOneChar,
        isCloseButtonFocusVisible,
      }),
    [
      ...Object.values(variantProps),
      isCloseButtonFocusVisible,
      hasLeftContent,
      hasRightContent,
      isOneChar,
    ],
  );

  const {pressProps: closePressProps} = usePress({
    isDisabled: !!originalProps?.isDisabled,
    onPress: onClose,
  });

  const getChipProps: PropGetter = () => {
    return {
      ref: domRef,
      className: slots.base({class: baseStyles}),
      ...otherProps,
    };
  };

  const getCloseButtonProps: PropGetter = () => {
    return {
      role: "button",
      tabIndex: 0,
      className: slots.closeButton({class: styles?.closeButton}),
      ...mergeProps(closePressProps, closeFocusProps),
    };
  };

  const getAvatarClone = (avatar: ReactNode) => {
    if (!isValidElement(avatar)) return null;

    return cloneElement(avatar, {
      // @ts-ignore
      className: slots.avatar({class: styles?.avatar}),
    });
  };

  const getContentClone = (content: ReactNode) =>
    isValidElement(content)
      ? cloneElement(content, {
          // @ts-ignore
          className: clsx("max-h-[80%]", content.props.className),
        })
      : null;

  return {
    Component,
    children,
    slots,
    styles,
    isDot: isDotVariant,
    isCloseable,
    leftContent: getAvatarClone(avatar) || getContentClone(leftContent),
    rightContent: getContentClone(rightContent),
    getCloseButtonProps,
    getChipProps,
  };
}

export type UseChipReturn = ReturnType<typeof useChip>;
