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

interface StyledValueProps {
  unimportant?: boolean;
}

const StyledWeatherValue = styled.div<StyledValueProps>`
  opacity: ${props => props.unimportant ? '0.5' : '1'};
` 

const StyledLabel = styled.p`
  font-size: 0.85rem;
  font-family: 'Rubik';
  font-weight: 400;
  opacity: 0.5;
  margin: 0;
`

const StyleValue = styled.span`
  font-family: 'Rubik';
  font-weight: 700;
  margin: 0;
  font-size: 1.5rem;
`

const StyledValueIcon = styled.img`
  display: inline-block;
  width: 12px;
  height: 12px;
  transform: translateX(-2px);
  margin-right: 8px;
  margin-bottom: 2px;
`

const StyledUnit = styled.span`

  font-family: 'Rubik';
  font-weight: 400;
  /* opacity: 0.5; */
  font-size: 1.125rem;
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
`

const StyledForecastIcon = styled.img`
  width: 88px;
`

const StyledRule = styled.hr`
  margin: 0;
`

const iconMappings: { [key: string]: string } = mappings

const Dashboard = (props: DashboardProps) => {

  // TIME DATA

  const getTimeData = (): iTimeData => ({
    date: moment().format('dd, DD.MM.YYYY'),
    time: moment().format('hh:mm')
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
      if (!didCancel) {
        setTimeData(getTimeData())
      } else {
        clearInterval(refreshTimeInterval)
      }
    }
    refreshTimeInterval = setInterval(refreshTimeData, timeInterval)

    // REFRESH WEATHER DATA
    const refreshWeatherData = async () => {
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
                  <StyledLabel>Temperature</StyledLabel>
                  <StyleValue>
                    {weatherData.indoorTemperature}
                  </StyleValue>
                  &ensp;
                  <StyledUnit>
                    {weatherData.indoorTemperatureUnits}
                  </StyledUnit>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <StyledLabel>CO2</StyledLabel>
                  <StyleValue>
                    {weatherData.indoorCO2}
                  </StyleValue>
                  &ensp;
                  <StyledUnit>
                    {weatherData.indoorCO2Units}
                  </StyledUnit>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <StyledLabel>Humidity</StyledLabel>
                  <StyleValue>
                    {weatherData.indoorHumidity}
                  </StyleValue>
                  &ensp;
                  <StyledUnit>
                    {weatherData.indoorHumidityUnits}
                  </StyledUnit>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <StyledLabel>Noise</StyledLabel>
                  <StyleValue>
                    {weatherData.indoorNoise}
                  </StyleValue>
                  &ensp;
                  <StyledUnit>
                    {weatherData.indoorNoiseUnits}
                  </StyledUnit>
                </StyledWeatherValue>
              </StyledIndoorWeatherInnerGrid>
            </StyledCellWeatherIndoor>
            <StyledCellWeatherOutdoor>
              <StyledOutdoorWeatherInnerGrid>
                <StyledWeatherValue>
                  <StyledLabel>Temperature</StyledLabel>
                  <div>
                    <StyleValue>
                      {weatherData.outdoorTemperature}
                    </StyleValue>
                    &ensp;
                    <StyledUnit>
                      {weatherData.outdoorTemperatureUnits}
                    </StyledUnit>
                  </div>
                </StyledWeatherValue>
                <StyledWeatherValue>
                  <StyledLabel>Humidity</StyledLabel>
                  <StyleValue>
                    {weatherData.outdoorHumidity}
                  </StyleValue>
                  &ensp;
                  <StyledUnit>
                    {weatherData.outdoorHumidityUnits}
                  </StyledUnit>
                </StyledWeatherValue>
              </StyledOutdoorWeatherInnerGrid>
            </StyledCellWeatherOutdoor>
          </>
        )}
      </StyledBoxWeather>
      <StyledRule />
      <StyledForecastBox>
        {forecastData && forecastData.data.slice(0, 5).map((day, index) => (
          <StyledForecastDay key={day.datetime}>
            <StyledForecastIcon src={`/png/${iconMappings[day.weather.code]}.png`} alt={day.weather.icon} />
            <StyledLabel>
              { index === 0 ? 'Heute' : moment(day.ts*1000).format('DD.MM.YYYY')}
            </StyledLabel>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/wi-direction-up.png`} alt="max temperature" />
              <StyleValue>
                {day.max_temp.toFixed(1)}
              </StyleValue>
              &ensp;
              <StyledUnit>
                °C
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue unimportant>
              <StyledValueIcon src={`/png/wi-direction-down.png`} alt="max temperature" />
              <StyleValue>
                {day.min_temp.toFixed(1)}
              </StyleValue>
              &ensp;
              <StyledUnit>
                °C
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/wi-raindrops.png`} alt="max temperature" />
              <StyleValue>
                {day.rh}
              </StyleValue>
              &ensp;
              <StyledUnit>
                %
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/wi-umbrella.png`} alt="max temperature" />
              <StyleValue>
                {day.pop}
              </StyleValue>
              &ensp;
              <StyledUnit>
                %
              </StyledUnit>
            </StyledWeatherValue>
          </StyledForecastDay>
        ))}
      </StyledForecastBox>
      <StyledRule />
    </>
  )
}

export default Dashboard
