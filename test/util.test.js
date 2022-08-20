const { isValidSortType, sortPeople } = require('../src/util');
const { SORT_TYPES } = require('../src/constants');
const { peopleMocked } = require('./mocks');

describe('util', () => {

    describe('isValidSortType', () => {
        it('returns false when given type is invalid', () => {
            expect(isValidSortType('notAValidType')).toEqual(false)
        })
        it('returns true when given type is valid', () => {
            Object.values(SORT_TYPES).forEach(type => {
                expect(isValidSortType(type)).toEqual(true);
            })
        })
    })

    describe('sortPeople', () => {
        it('sorts people by mass asc', () => {
            expect(sortPeople(peopleMocked, SORT_TYPES.MASS)).toMatchSnapshot();
        })
        it('sorts people by height asc', () => {
            expect(sortPeople(peopleMocked, SORT_TYPES.HEIGHT)).toMatchSnapshot();
        })
        it('sorts people by name asc', () => {
            expect(sortPeople(peopleMocked, SORT_TYPES.NAME)).toMatchSnapshot();
        })
    })

})