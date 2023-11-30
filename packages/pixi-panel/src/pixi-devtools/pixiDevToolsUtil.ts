import { Mat4 } from "pixi3d";
import type { AngleOrder, PointLike3D, QuaternionLike } from "../types";

export function between(x: number, min: number, max: number): boolean {
  return x >= min && x <= max;
}

export const roundUp = (num: number): number =>
  Math.round((num + Number.EPSILON) * 100) / 100;

export const mod360 = (degrees: number): number => (360 + degrees) % 360;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Reference https://github.com/toji/gl-matrix/blob/master/src/common.js#L7C24-L7C32s
 */
export const GL_EPSILON = 0.000001;

/**
 * Returns an euler angle representation of a quaternion
 * @param  {QuaternionLike} quat Quaternion
 * @return {PointLike3D}
 */
export function getEulerAngles(
  { x, y, z, w }: QuaternionLike,
  order: AngleOrder = "ZYX",
): PointLike3D {
  const rm = Mat4.fromQuat(new Float32Array([x, y, z, w]));
  // eslint-disable-next-line one-var
  const m11 = rm[0], m12 = rm[4], m13 = rm[8];
  // eslint-disable-next-line one-var
  const m21 = rm[1], m22 = rm[5], m23 = rm[9];
  // eslint-disable-next-line one-var
  const m31 = rm[2], m32 = rm[6], m33 = rm[10];

  let pitch: number = 0;
  let yaw: number = 0;
  let roll: number = 0;

  switch (order) {
    case "XYZ":
      pitch = Math.asin(clamp(m13, -1, 1));
      if (Math.abs(m13) < 0.9999999) {
        yaw = Math.atan2(-m23, m33);
        roll = Math.atan2(-m12, m11);
      } else {
        yaw = Math.atan2(m32, m22);
        roll = 0;
      }
      break;

    case "YXZ":
      yaw = Math.asin(-clamp(m23, -1, 1));
      if (Math.abs(m23) < 0.9999999) {
        pitch = Math.atan2(m13, m33);
        roll = Math.atan2(m21, m22);
      } else {
        pitch = Math.atan2(-m31, m11);
        roll = 0;
      }
      break;

    case "ZXY":
      yaw = Math.asin(clamp(m32, -1, 1));
      if (Math.abs(m32) < 0.9999999) {
        pitch = Math.atan2(-m31, m33);
        roll = Math.atan2(-m12, m22);
      } else {
        pitch = 0;
        roll = Math.atan2(m21, m11);
      }

      break;
    case "ZYX":
      pitch = Math.asin(-clamp(m31, -1, 1));
      if (Math.abs(m31) < 0.9999999) {
        yaw = Math.atan2(m32, m33);
        roll = Math.atan2(m21, m11);
      } else {
        yaw = 0;
        roll = Math.atan2(-m12, m22);
      }
      break;

    case "YZX":
      roll = Math.asin(clamp(m21, -1, 1));
      if (Math.abs(m21) < 0.9999999) {
        yaw = Math.atan2(-m23, m22);
        pitch = Math.atan2(-m31, m11);
      } else {
        yaw = 0;
        pitch = Math.atan2(m13, m33);
      }

      break;

    case "XZY":
      roll = Math.asin(-clamp(m12, -1, 1));
      if (Math.abs(m12) < 0.9999999) {
        yaw = Math.atan2(m32, m22);
        pitch = Math.atan2(m13, m11);
      } else {
        yaw = Math.atan2(-m23, m33);
        pitch = 0;
      }

      break;

    default:
      throw new Error(`AngleOrder not recognized - ${order}`);
  }

  return {
    x: yaw * (180 / Math.PI),
    y: pitch * (180 / Math.PI),
    z: roll * (180 / Math.PI),
  };
}
