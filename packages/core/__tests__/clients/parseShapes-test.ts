/**
 * Adapted from AWS SDK:
 * * https://github.com/aws/aws-sdk-js-v3/blob/main/packages/smithy-client/src/parse-utils.spec.ts
 * * https://github.com/aws/aws-sdk-js-v3/blob/main/packages/smithy-client/src/date-utils.spec.ts
 */
import { expectString, parseEpochTimestamp } from '../../src/clients/serde';

const logger = {
	warn: console.warn,
};

describe('expectString', () => {
	it('accepts strings', () => {
		expect(expectString('foo')).toEqual('foo');
	});

	it.each([null, undefined])('accepts %s', value => {
		expect(expectString(value)).toEqual(undefined);
	});

	describe('reluctantly', () => {
		let consoleMock: jest.SpyInstance;
		beforeEach(() => {
			consoleMock = jest.spyOn(logger, 'warn').mockImplementation();
		});

		afterEach(() => {
			consoleMock.mockRestore();
		});

		it.each([1, NaN, Infinity, -Infinity, true, false])(
			'accepts numbers or booleans: %s',
			value => {
				expect(expectString(value)).toEqual(String(value));
				expect(logger.warn).toHaveBeenCalled();
			}
		);
	});

	describe('rejects non-strings', () => {
		it.each([[], {}])('rejects %s', value => {
			expect(() => expectString(value)).toThrowError();
		});
	});
});

describe('parseEpochTimestamp', () => {
	it.each([null, undefined])('returns undefined for %s', value => {
		expect(parseEpochTimestamp(value)).toBeUndefined();
	});

	describe('parses properly formatted dates', () => {
		describe('with fractional seconds', () => {
			it.each(['482196050.52', 482196050.52])('parses %s', value => {
				expect(parseEpochTimestamp(value)).toEqual(
					new Date(Date.UTC(1985, 3, 12, 23, 20, 50, 520))
				);
			});
		});
		describe('without fractional seconds', () => {
			it.each(['482196050', 482196050, 482196050.0])('parses %s', value => {
				expect(parseEpochTimestamp(value)).toEqual(
					new Date(Date.UTC(1985, 3, 12, 23, 20, 50, 0))
				);
			});
		});
	});
	it.each([
		'1985-04-12T23:20:50.52Z',
		'1985-04-12T23:20:50Z',
		'Mon, 31 Dec 1990 15:59:60 GMT',
		'Monday, 31-Dec-90 15:59:60 GMT',
		'Mon Dec 31 15:59:60 1990',
		'NaN',
		NaN,
		'Infinity',
		Infinity,
		'0x42',
	])('rejects %s', value => {
		expect(() => parseEpochTimestamp(value)).toThrowError();
	});
});
