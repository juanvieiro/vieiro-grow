const {
    API_CALLS,
    SORT_TYPES
} = require('./constants');
const axios = require('axios');

const { SWAPI_API_BASE_URL, PEOPLE_ENDPOINT } = API_CALLS;
const { NAME } = SORT_TYPES;

exports.isValidSortType = (sort) =>
    Object.values(SORT_TYPES).includes(sort);

exports.sortPeople = (people, sortType) =>
    people.sort((current, next) => {
        const currentValue = sortType === NAME ?
            current[sortType] : Number(current[sortType]);

        const nextValue = sortType === NAME ?
            next[sortType] : Number(next[sortType]);

        if (currentValue < nextValue) return -1;
        if (currentValue > nextValue) return 1;
        return 0;
    })

const getResults = async (results, next) => {
    if (next === null) return results;
    const { data } = await axios.get(next);
    return getResults(results.concat(data.results), data.next);
}

exports.getAllResults = async (resourceEndpoint) => {
    const { data } = await axios.get(`${SWAPI_API_BASE_URL}${resourceEndpoint}`);
    const results = await getResults(data.results, data.next);
    return results
}
