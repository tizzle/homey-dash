import React from 'react'

import fetch from 'isomorphic-unfetch'

import { Global, css } from '@emotion/core'
import styled from '@emotion/styled'

import normalize from './styles/normalize'
import { colors } from './styles/variables'
import mappings from './mappings/weatherbit.json'
import { HomeyAPI } from 'athom-api';

import moment from 'moment';
import 'moment/locale/de';

export interface DashboardProps {
  homeyAPI: HomeyAPI;
}

interface iTimeData {
  date: string | undefined
  time: string | undefined
}

interface iWeatherData {
  indoorTemperature: string
  indoorTemperatureUnits: string
  indoorHumidity: string
  indoorHumidityUnits: string
  indoorCO2: string
  indoorCO2Units: string
  indoorNoise: string
  indoorNoiseUnits: string
  outdoorTemperature: string
  outdoorTemperatureUnits: string
  outdoorHumidity: string
  outdoorHumidityUnits: string
}

interface iHomeyInsightLog {
  lastValue: string
  units: string
}

interface iForecastData {
  data: {  
    valid_date: string
    ts: number
    datetime: string
    wind_gust_spd: number
    wind_spd: number
    wind_dir: number
    wind_cdir: string
    wind_cdir_full: string
    temp: number
    max_temp: number
    min_temp: number
    app_max_temp: number
    app_min_temp: number
    pop: number
    precip: number
    snow: number
    snow_depth: number
    slp: number
    pres: number
    dewpt: number
    rh: number
    weather: {  
      icon: string
      code: string
      description: string
    },
    pod: string
    clouds_low: number
    clouds_mid: number
    clouds_hi: number
    clouds: number
    vis: number
    max_dhi: number
    uv: number
    moon_phase: number
    moonrise_ts: number
    moonset_ts: number
    sunrise_ts: number
    sunset_ts: number
  }[],
  city_name: string
  lon: string
  timezone: string
  lat: string
  country_code: string
  state_code: string
}

const StyledBox = styled.div`
  padding: 2rem;
`

const StyledBoxClock = styled(StyledBox)`
  font-family: 'Rubik-Mono';
  line-height: 1;
`

const StyledBoxWeather = styled.div`
  display: flex;

  > *:first-child {
    width: 66.66%;
  }
  
  > *:last-child {
    width: 33.33%;
  }
`

const StyledCellWeatherIndoor = styled(StyledBox)`
  border-right: 1px solid ${colors.ui.bright};
`

const StyledCellWeatherOutdoor = styled(StyledBox)``

const StyledIndoorWeatherInnerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;

  > * {
    width: calc(50% - 1rem);
  }

  > *:nth-child(odd) {
    margin-right: 2rem;
  }

  > *:not(:nth-last-child(-n+2)) {
    margin-bottom: 2rem;
  }
`

const StyledOutdoorWeatherInnerGrid = styled.div`
  > *:not(:last-child) {
    margin-bottom: 2rem;
  }
`

const StyledWeatherValue = styled.div`
  span {
    font-size: 1rem;
    font-family: 'Rubik';
    font-weight: 500;
  }

  > p {
    font-family: 'Rubik';
    font-weight: 700;
    margin: 0;
    font-size: 1.5rem;
  }
`

const StyledForecastBox = styled.div`
  display: flex;
  padding: 2rem;
  
  > * {
    width: 115.2px;  
  }

  > *:not(:last-child) {
    margin-right: 2rem;
  }
`

const StyledForecastDay = styled.div`
  /* padding: 2rem; */
  img {
    width: 75%;
  }
`

const StyledRule = styled.hr`
  margin: 0;
`

const iconMappings: { [key: string]: string } = mappings

const Dashboard = (props: DashboardProps) => {

  // TIME DATA

  const getTimeData = (): iTimeData => ({
    date: moment().format('dd, DD.MM.YYYY'),
    time: moment().format('h:mm')
  })

  const [timeData, setTimeData] = React.useState(getTimeData())


  // WEATHER DATA

  const getWeatherData = async (): Promise<iWeatherData> => {
    const indoorTemperature = await props.homeyAPI.insights.getLog({
      uri: 'homey:device:fad84db7-eb87-4110-bb60-38d658933797',
      id: 'measure_temperature'
    }) as iHomeyInsightLog
    const indoorHumidity = await props.homeyAPI.insights.getLog({
      uri: 'homey:device:fad84db7-eb87-4110-bb60-38d658933797',
      id: 'measure_humidity'
    }) as iHomeyInsightLog
    const indoorCo2 = await props.homeyAPI.insights.getLog({
      uri: 'homey:device:fad84db7-eb87-4110-bb60-38d658933797',
      id: 'measure_co2'
    }) as iHomeyInsightLog
    const indoorNoise = await props.homeyAPI.insights.getLog({
      uri: 'homey:device:fad84db7-eb87-4110-bb60-38d658933797',
      id: 'measure_noise'
    }) as iHomeyInsightLog
    const outdoorTemperature = await props.homeyAPI.insights.getLog({
      uri: 'homey:device:7df4300e-4280-4d06-84f0-f47d6923f87a',
      id: 'measure_temperature'
    }) as iHomeyInsightLog
    const outdoorHumidity = await props.homeyAPI.insights.getLog({
      uri: 'homey:device:7df4300e-4280-4d06-84f0-f47d6923f87a',
      id: 'measure_humidity'
    }) as iHomeyInsightLog

    console.log(indoorTemperature);

    return {
      indoorTemperature: indoorTemperature.lastValue,
      indoorTemperatureUnits: indoorTemperature.units,
      indoorHumidity: indoorHumidity.lastValue,
      indoorHumidityUnits: indoorHumidity.units,
      indoorCO2: indoorCo2.lastValue,
      indoorCO2Units: indoorCo2.units,
      indoorNoise: indoorNoise.lastValue,
      indoorNoiseUnits: indoorNoise.units,
      outdoorTemperature: outdoorTemperature.lastValue,
      outdoorTemperatureUnits: outdoorTemperature.units,
      outdoorHumidity: outdoorHumidity.lastValue,
      outdoorHumidityUnits: outdoorHumidity.units
    }
  }

  const [weatherData, setWeatherData] = React.useState<iWeatherData | null>(null)


  // FORECAST DATA

  const getForecastData = async (): Promise<iForecastData> => {
    const response = await fetch(
      'https://api.weatherbit.io/v2.0/forecast/daily?key=166faceaea164d4ea2937c00e47523f4&lang=de&days=6&lat=53.56&lon=9.96',
      {
        method: 'GET'
      }
    )
    const data = await response.json()
    return data;
  }

  const [forecastData, setForecastData] = React.useState<iForecastData | null>(null)


  // FETCH ALL THIS REPEATEDLY

  React.useEffect(() => {
    let didCancel = false

    const timeInterval = 10000;
    const weatherInterval = 60000;
    const forecastInterval = 172800;

    let refreshTimeInterval: NodeJS.Timeout
    let refreshWeatherInterval: NodeJS.Timeout
    let refreshForecastInterval: NodeJS.Timeout

    // REFRESH TIME DATA
    const refreshTimeData = async () => {
      console.log('refetching time')
      if (!didCancel) {
        setTimeData(getTimeData())
      } else {
        clearInterval(refreshTimeInterval)
      }
    }
    refreshTimeInterval = setInterval(refreshTimeData, timeInterval)

    // REFRESH WEATHER DATA
    const refreshWeatherData = async () => {
      console.log('refetching weather')
      const weatherData = await getWeatherData()
      if (!didCancel) {
        setWeatherData(weatherData)
      } else {
        clearInterval(refreshWeatherInterval)
      }
    }
    refreshWeatherInterval = setInterval(refreshWeatherData, weatherInterval)

    // REFRESH FORECAST DATA
    const refreshForecastData = async () => {
      console.log('refetching forecast')
      const forecastData = await getForecastData()
      if (!didCancel) {
        setForecastData(forecastData)
      } else {
        clearInterval(refreshForecastInterval)
      }
    }
    refreshForecastInterval = setInterval(refreshForecastData, forecastInterval)

    refreshTimeData();
    refreshWeatherData();
    refreshForecastData();

    return () => {
      didCancel = true
    }
  }, [])

  // console.log('rendering', timeData, weatherData, forecastData);

  return (
    <>
      <Global styles={() => css(normalize)} />
      <StyledBoxClock>
        <p style={{ fontSize: '165px'}}>{timeData.time}</p>
        <p style={{ fontSize: '59px'}}>{timeData.date}</p>
      </StyledBoxClock>
      <StyledRule />
      <StyledBoxWeather>
        {weatherData && (
          <>
            <StyledCellWeatherIndoor>
              <StyledIndoorWeatherInnerGrid>
                <StyledWeatherValue>
                  <span>Temperature</span>
                  <p>
                    {weatherData.indoorTemperature}
                    <span>&nbsp;&nbsp;{weatherData.indoorTemperatureUnits}</span>
                  </p>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <span>CO2</span>
                  <p>
                    {weatherData.indoorCO2}
                    <span>&nbsp;&nbsp;{weatherData.indoorCO2Units}</span>
                  </p>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <span>Humidity</span>
                  <p>
                    {weatherData.indoorHumidity}
                    <span>&nbsp;&nbsp;{weatherData.indoorHumidityUnits}</span>
                  </p>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <span>Noise</span>
                  <p>
                    {weatherData.indoorNoise}
                    <span>&nbsp;&nbsp;{weatherData.indoorNoiseUnits}</span>
                  </p>
                </StyledWeatherValue>
              </StyledIndoorWeatherInnerGrid>
            </StyledCellWeatherIndoor>
            <StyledCellWeatherOutdoor>
              <StyledOutdoorWeatherInnerGrid>
                <StyledWeatherValue>
                  <span>Temperature</span>
                  <p>
                    {weatherData.outdoorTemperature}
                    <span>&nbsp;&nbsp;{weatherData.outdoorTemperatureUnits}</span>
                  </p>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <span>Humidity</span>
                  <p>
                    {weatherData.outdoorHumidity}
                    <span>&nbsp;&nbsp;{weatherData.outdoorHumidityUnits}</span>
                  </p>
                </StyledWeatherValue>
              </StyledOutdoorWeatherInnerGrid>
            </StyledCellWeatherOutdoor>
          </>
        )}
      </StyledBoxWeather>
      <StyledRule />
      <StyledForecastBox>
        {forecastData && forecastData.data.slice(1, 6).map(day => (
          <StyledForecastDay key={day.datetime}>
            <img src={`/png/${iconMappings[day.weather.code]}.png`} alt={day.weather.icon} />
            <div>
              {moment(day.ts*1000).format('DD.MM.YYYY')}
            </div>
            <StyledWeatherValue>
              <p>
                {day.min_temp.toFixed(1)} <span>°C</span>
              </p>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <p>
                {day.max_temp.toFixed(1)} <span>°C</span>
              </p>
            </StyledWeatherValue>
            <p>{day.precip}</p>
            {/* {console.log(day)} */}
          </StyledForecastDay>
        ))}
      </StyledForecastBox>
      <StyledRule />
    </>
  )
}

export default Dashboard
