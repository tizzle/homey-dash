import React from 'react'

import fetch from 'isomorphic-unfetch'

import { Global, css } from '@emotion/core'
import styled from "@emotion/styled/macro";

import { HomeyAPI } from 'athom-api';

import normalize from './styles/normalize'
import { colors } from './styles/variables'

import darkskyMappings from './mappings/darksky.json'
import moonMappings from './mappings/moonphases.json'

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
  indoorHumidity: string
  indoorCO2: string
  indoorNoise: string
  outdoorTemperature: string
  outdoorHumidity: string
}

interface iWeatherDataUnits {
  indoorTemperatureUnits: string
  indoorHumidityUnits: string
  indoorCO2Units: string
  indoorNoiseUnits: string
  outdoorTemperatureUnits: string
  outdoorHumidityUnits: string
}

interface iHomeyDevice extends HomeyAPI.ManagerDevices.Device {
  capabilitiesObj: {
    [key: string]: {
      value: number
      units: string
    }
  }
}

interface iForecastData {
  daily: {
    data: {
      time: number
      icon: string
      temperatureMin: number
      temperatureMax: number
      humidity: number
      precipProbability: number
      moonPhase: number
    }[]
  }
}

const StyledBox = styled.div`
  padding: 2rem;
`

const StyledBoxClock = styled(StyledBox)`
  position: relative;
  font-family: 'Rubik-Mono';
  line-height: 1;
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

  > *:nth-of-type(odd) {
    margin-right: 2rem;
  }

  > *:not(:nth-last-of-type(-n+2)) {
    margin-bottom: 1rem;
  }
`

const StyledOutdoorWeatherInnerGrid = styled.div`
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const StyledBoxWeather = styled.div`
  position: relative;
  display: flex;

  > ${StyledCellWeatherIndoor} {
    width: 66.66%;
  }
  
  > ${StyledCellWeatherOutdoor} {
    width: 33.33%;
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
  width: 22px;
  height: 22px;
  transform: translateY(3px);
  margin-right: 8px;
`

const StyledUnit = styled.span`

  font-family: 'Rubik';
  font-weight: 400;
  font-size: 1.125rem;
`

const StyledForecastBox = styled.div`
  position: relative;
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
  > *, > ${StyledLabel} {
    margin-bottom: 0.5rem;
  }
`

const StyledForecastIcon = styled.img`
  width: 88px;
`

const StyledRule = styled.hr`
  margin: 0;
`

const StyledSmallText = styled.span`
  font-size: 0.825rem;
  transform: translateY(-3px);
  display: inline-block;
`

const StyledLastUpdated = styled.div`
  font-family: 'Rubik';
  font-weight: 400;
  font-size: 0.5rem;
  position: absolute;
  top: 8px;
  right: 8px;
  margin: 0 !important;
  text-align: right;
  opacity: 0.25;
`

const darkskyIconMappings: { [key: string]: string } = darkskyMappings
const moonphasesMappings: { [key: string]: string } = moonMappings


// TIME DATA

const getTimeData = (): iTimeData => ({
  date: moment().format('dd, DD.MM.YYYY'),
  time: moment().format('HH:mm')
})


// FORECAST DATA

const proxy = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = 'https://api.darksky.net/forecast/e4e1f7df1454a1246c05f4ad1c0ccbae/53.56,9.96?units=ca'

const getForecastData = async (): Promise<iForecastData> => {
  const response = await fetch(
    `${proxy}${apiUrl}`,
    {
      method: 'GET',
      headers: {'Cache-Control': 'no-cache'}
    }
  )
  const data = await response.json()
  return data;
}


const Dashboard = (props: DashboardProps) => {

  // DATA
  const [timeData, setTimeData] = React.useState(getTimeData())
  const [weatherDataUnits, setWeatherDataUnits] = React.useState<iWeatherDataUnits | null>(null)
  const [indoorTemperature, setIndoorTemperature] = React.useState<iWeatherData['indoorTemperature'] | null>(null)
  const [indoorCO2, setIndoorCO2] = React.useState<iWeatherData['indoorCO2'] | null>(null)
  const [indoorHumidity, setIndoorHumidity] = React.useState<iWeatherData['indoorHumidity'] | null>(null)
  const [indoorNoise, setIndoorNoise] = React.useState<iWeatherData['indoorNoise'] | null>(null)
  const [outdoorTemperature, setOutdoorTemperature] = React.useState<iWeatherData['outdoorTemperature'] | null>(null)
  const [outdoorHumidity, setOutdoorHumidity] = React.useState<iWeatherData['outdoorHumidity'] | null>(null)
  const [forecastData, setForecastData] = React.useState<iForecastData | null>(null)

  // UPDATE TRACKER
  const [lastUpdatedTimeData, setLastUpdatedTimeData] = React.useState(moment())
  const [lastUpdatedWeatherData, setLastUpdatedWeatherData] = React.useState(moment())
  const [lastUpdatedForecastData, setLastUpdatedForecastData] = React.useState(moment())



// WEATHER DATA

const getNetatmoDevices = async () => {
  console.log('getNetatmoDevices')
  const netatmoIndoor = await props.homeyAPI.devices.getDevice({id:'fad84db7-eb87-4110-bb60-38d658933797'}) as iHomeyDevice
  const netatmoOutdoor = await props.homeyAPI.devices.getDevice({id:'7df4300e-4280-4d06-84f0-f47d6923f87a'}) as iHomeyDevice

  netatmoIndoor.makeCapabilityInstance('measure_temperature', (value: any) => {
    console.log('indoor measure_temperature', value)
    setIndoorTemperature(value.toFixed(1))
    setLastUpdatedWeatherData(moment())
  })
  
  netatmoIndoor.makeCapabilityInstance('measure_humidity', (value: any) => {
    console.log('indoor measure_humidity', value)
    setIndoorHumidity(value.toFixed(1))
    setLastUpdatedWeatherData(moment())
  })

  netatmoIndoor.makeCapabilityInstance('measure_co2', (value: any) => {
    console.log('indoor measure_co2', value)
    setIndoorCO2(value.toFixed(1))
    setLastUpdatedWeatherData(moment())
  })

  netatmoIndoor.makeCapabilityInstance('measure_noise', (value: any) => {
    console.log('indoor measure_noise', value)
    setIndoorNoise(value.toFixed(1))
    setLastUpdatedWeatherData(moment())
  })
  
  netatmoOutdoor.makeCapabilityInstance('measure_temperature', (value: any) => {
    console.log('outdoor measure_temperature', value)
    setOutdoorTemperature(value.toFixed(1))
    setLastUpdatedWeatherData(moment())
  })
  
  netatmoOutdoor.makeCapabilityInstance('measure_humidity', (value: any) => {
    console.log('indoor measure_humidity', value)
    setOutdoorHumidity(value.toFixed(1))
    setLastUpdatedWeatherData(moment())
  })

  setIndoorTemperature(netatmoIndoor.capabilitiesObj.measure_temperature.value.toFixed(1))
  setIndoorHumidity(netatmoIndoor.capabilitiesObj.measure_humidity.value.toFixed(0))
  setIndoorCO2(netatmoIndoor.capabilitiesObj.measure_co2.value.toFixed(0))
  setIndoorNoise(netatmoIndoor.capabilitiesObj.measure_noise.value.toFixed(0))
  setOutdoorTemperature(netatmoOutdoor.capabilitiesObj.measure_temperature.value.toFixed(1))
  setOutdoorHumidity(netatmoOutdoor.capabilitiesObj.measure_humidity.value.toFixed(0))
  
  setWeatherDataUnits({
    indoorTemperatureUnits: netatmoIndoor.capabilitiesObj.measure_temperature.units,
    indoorHumidityUnits: netatmoIndoor.capabilitiesObj.measure_humidity.units,
    indoorCO2Units: netatmoIndoor.capabilitiesObj.measure_co2.units,
    indoorNoiseUnits: netatmoIndoor.capabilitiesObj.measure_noise.units,
    outdoorTemperatureUnits: netatmoOutdoor.capabilitiesObj.measure_temperature.units,
    outdoorHumidityUnits: netatmoOutdoor.capabilitiesObj.measure_humidity.units,
  })

}

  // FETCH DATA (EXCEPT HOMEY) REPEATEDLY


  React.useEffect(() => {
    let didCancel = false

    const timeInterval = 10000; // every 10 seconds
    const forecastInterval = 300000; // every 5 minutes

    let refreshTimeInterval: NodeJS.Timeout
    let refreshForecastInterval: NodeJS.Timeout

    // REFRESH TIME DATA
    const refreshTimeData = async () => {
      if (!didCancel) {
        setTimeData(getTimeData())
        setLastUpdatedTimeData(moment())
      } else {
        clearInterval(refreshTimeInterval)
      }
    }
    
    // REFRESH FORECAST DATA
    const refreshForecastData = async () => {
      if (!didCancel) {
        const forecastData = await getForecastData()
        setForecastData(forecastData)
        setLastUpdatedForecastData(moment())
      } else {
        clearInterval(refreshForecastInterval)
      }
    }

    refreshTimeData();
    refreshForecastData();
    getNetatmoDevices();

    refreshTimeInterval = setInterval(refreshTimeData, timeInterval)
    refreshForecastInterval = setInterval(refreshForecastData, forecastInterval)

    return () => {
      didCancel = true
    }
  }, [])

  return (
    <>
      <Global styles={() => css(normalize)} />
      <StyledBoxClock>
        <StyledLastUpdated>Last updated: {lastUpdatedTimeData.format('DD/MM HH:mm:ss')}</StyledLastUpdated>
        <p style={{ fontSize: '165px'}}>{timeData.time}</p>
        <p style={{ fontSize: '59px'}}>{timeData.date}</p>
      </StyledBoxClock>
      <StyledRule />
      <StyledBoxWeather>
        <StyledLastUpdated>Last updated: {lastUpdatedWeatherData.format('DD/MM HH:mm:ss')}</StyledLastUpdated>
        <StyledCellWeatherIndoor>
          <StyledIndoorWeatherInnerGrid>
            <StyledWeatherValue>
              <StyledLabel>Temperature</StyledLabel>
              <StyleValue>
                {indoorTemperature}
              </StyleValue>
              &ensp;
              <StyledUnit>
                {weatherDataUnits && weatherDataUnits.indoorTemperatureUnits}
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledLabel>CO2</StyledLabel>
              <StyleValue>
                {indoorCO2}
              </StyleValue>
              &ensp;
              <StyledUnit>
                {weatherDataUnits && weatherDataUnits.indoorCO2Units}
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledLabel>Humidity</StyledLabel>
              <StyleValue>
                {indoorHumidity}
              </StyleValue>
              &ensp;
              <StyledUnit>
                {weatherDataUnits && weatherDataUnits.indoorHumidityUnits}
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledLabel>Noise</StyledLabel>
              <StyleValue>
                {indoorNoise}
              </StyleValue>
              &ensp;
              <StyledUnit>
                {weatherDataUnits && weatherDataUnits.indoorNoiseUnits}
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
                  {outdoorTemperature}
                </StyleValue>
                &ensp;
                <StyledUnit>
                  {weatherDataUnits && weatherDataUnits.outdoorTemperatureUnits}
                </StyledUnit>
              </div>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledLabel>Humidity</StyledLabel>
              <StyleValue>
                {outdoorHumidity}
              </StyleValue>
              &ensp;
              <StyledUnit>
                {weatherDataUnits && weatherDataUnits.outdoorHumidityUnits}
              </StyledUnit>
            </StyledWeatherValue>
          </StyledOutdoorWeatherInnerGrid>
        </StyledCellWeatherOutdoor>
      </StyledBoxWeather>
      <StyledRule />
      <StyledForecastBox>
        <StyledLastUpdated>Last updated: {lastUpdatedForecastData.format('DD/MM HH:mm:ss')}</StyledLastUpdated>
        {forecastData && forecastData.daily.data.slice(0, 5).map((day, index) => (
          <StyledForecastDay key={day.time}>
            <StyledForecastIcon src={`/png/${darkskyIconMappings[day.icon]}.png`} alt={day.icon} />
            <StyledLabel>
              { index === 0 ? 'Heute' : moment(day.time*1000).format('DD.MM.YYYY')}
            </StyledLabel>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/arrow-up.png`} alt="max temperature" />
              <StyleValue>
                {day.temperatureMax.toFixed(1)}
              </StyleValue>
              &ensp;
              <StyledUnit>
                °C
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue unimportant>
              <StyledValueIcon src={`/png/arrow-down.png`} alt="min temperature" />
              <StyleValue>
                {day.temperatureMin.toFixed(1)}
              </StyleValue>
              &ensp;
              <StyledUnit>
                °C
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/humidity.png`} alt="humidity" />
              <StyleValue>
                {(day.humidity*100).toFixed(0)}
              </StyleValue>
              &ensp;
              <StyledUnit>
                %
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/umbrella.png`} alt="likelihood of rain" />
              <StyleValue>
                {(day.precipProbability*100).toFixed(0)}
              </StyleValue>
              &ensp;
              <StyledUnit>
                %
              </StyledUnit>
            </StyledWeatherValue>
            <StyledWeatherValue>
              <StyledValueIcon src={`/png/moon_${Math.round(day.moonPhase*16)/16}.png`} alt="moon phase" />
              <StyledSmallText>
                {moonphasesMappings[Math.round(day.moonPhase*16)/16]}
              </StyledSmallText>
            </StyledWeatherValue>
          </StyledForecastDay>
        ))}
      </StyledForecastBox>
      <StyledRule />
    </>
  )
}

export default Dashboard
