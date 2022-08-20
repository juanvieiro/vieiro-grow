const express = require('express')
const axios = require('axios');
const { API_CALLS, ROUTES } = require('./constants');
const { isValidSortType, getAllResults, sortPeople } = require('./util');

const logger = console;
const port = 3000;
const { PEOPLE, PLANETS } = ROUTES;

const INVALID_SORT_MESSAGE = 'Given sort type is invalid';
const INTERNAL_ERROR_MESSAGE = 'Internal Error';
const BAD_REQUEST_ERROR_MESSAGE = 'Bad Request';
const INTERNAL_ERR_STATUS_CODE = 500;
const BAD_REQUEST_STATUS_CODE = 400;

const start = async () => {
    let app;
    try {
        const server = express();
        server.get(PEOPLE, async (req, res) => {
            try {
                const { sortBy } = req.query;
                if (sortBy && !isValidSortType(sortBy)) throw new Error(INVALID_SORT_MESSAGE);
                logger.info('About to get all results');
                let people = await getAllResults(API_CALLS.PEOPLE_ENDPOINT);
                if (sortBy) {
                    logger.info(`Sorting people by ${sortBy}`);
                    people = sortPeople(people, sortBy);
                }
                logger.info(`About to return ${people.length} people`);
                res.send(people);
            } catch (err) {
                logger.log(err);
                if (err.message === INVALID_SORT_MESSAGE) res.status(BAD_REQUEST_STATUS_CODE).send(BAD_REQUEST_ERROR_MESSAGE);
                res.status(INTERNAL_ERR_STATUS_CODE).send(INTERNAL_ERROR_MESSAGE);
            }
        });
        server.get(PLANETS, async (_, res) => {
            try {
                logger.info('Getting planets');
                const planets = await getAllResults(API_CALLS.PLANETS_ENDPOINT);
                logger.info('About to get residents data');
                const planetsWithResidents = await Promise.all(
                    planets.map(async (planet) => ({
                        ...planet,
                        residents: await Promise.all(
                            planet.residents.map(async (resident) => {
                                const { data } = await axios.get(resident);
                                return data.name;
                            })
                        )
                    }))
                );
                logger.info(`About to return ${planetsWithResidents.length} planets`);
                res.send(planetsWithResidents);
            } catch (error) {
                logger.error(err);
                res.status(INTERNAL_ERR_STATUS_CODE).send(INTERNAL_ERROR_MESSAGE);
            }
        });
        app = server.listen(port, () => {
            logger.info(`Server listening on port ${port}`);
        });
    } catch (error) {
        logger.error(error);
        app?.close();
        process.exit(1);
    }
};

start();