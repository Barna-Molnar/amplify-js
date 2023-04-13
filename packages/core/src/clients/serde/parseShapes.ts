// Adapted from the AWS SDK internal Smithy package: https://github.com/aws/aws-sdk-js-v3/blob/main/packages/smithy-client/src/parse-utils.ts

/**
 * @internal
 *
 * Asserts a value is a string and returns it.
 * Numbers and boolean will be cast to strings with a warning.
 *
 * @param value - A value that is expected to be a string.
 * @returns The value if it's a string, undefined if it's null/undefined,
 *   otherwise an error is thrown.
 */
export const expectString = (value: unknown): string | undefined => {
	if (value === null || value === undefined) {
		return undefined;
	}
	if (typeof value['toString'] === 'function') {
		return value.toString();
	}
	throw new TypeError(`Expected string, got ${typeof value}: ${value}`);
};

/**
 * @internal
 *
 * Parses a value into a Date. Returns undefined if the input is null or
 * undefined, throws an error if the input is not a number or a parseable string.
 *
 * Input strings must be an integer or floating point number. Fractional seconds are supported.
 *
 * @param value - the value to parse
 * @returns a Date or undefined
 */
export const parseEpochTimestamp = (value: unknown): Date | undefined => {
	if (value === null || value === undefined) {
		return undefined;
	}
	const valueAsDouble = expectNumber(value);
	if (!Number.isFinite(valueAsDouble) || Number.isNaN(valueAsDouble)) {
		throw new TypeError(
			'Epoch timestamps must be valid, non-Infinite, non-NaN numerics'
		);
	}
	return new Date(Math.round(valueAsDouble * 1000));
};

/**
 * @internal
 *
 * Asserts a value is a number and returns it.
 * Casts strings with a warning if the string is a parseable number.
 * This is to unblock slight API definition/implementation inconsistencies.
 *
 * @param value - A value that is expected to be a number.
 * @returns The value if it's a number, undefined if it's null/undefined,
 *   otherwise an error is thrown.
 */
export const expectNumber = (value: any): number | undefined => {
	if (value === null || value === undefined) {
		return undefined;
	}
	if (typeof value === 'string') {
		const parsed = parseFloat(value);
		if (!Number.isNaN(parsed)) {
			return parsed;
		}
	}
	if (typeof value === 'number') {
		return value;
	}
	throw new TypeError(`Expected number, got ${typeof value}: ${value}`);
};

// TODO: adapt other util functions as needed
