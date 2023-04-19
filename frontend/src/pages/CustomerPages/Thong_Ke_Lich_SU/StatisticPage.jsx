import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { useEffect, useState } from "react";
//import { Data } from "./Data.js";
import { getRecordList } from "../../../api/recordApi.js";
import LineChart from './LineChart.jsx';
import { Row, Col, Dropdown, DropdownButton, Form, Button } from "react-bootstrap";
import SideBar from "../../../components/GlobalStyles/SideBar.jsx";
import { useParams } from "react-router-dom";


function StatisticPage() { 
  const params = useParams()
  const [ chartData, setChartData ] = useState([])

  const loadData = async function (id) {
    return await getRecordList(id)
  } 

  const handleChangeDate = (e) => {
      e.preventDefault()
      let start = document.getElementById("start").value
      let end = document.getElementById("end").value
      if (!start)
          alert("Vui lòng nhập ngày bắt đầu")
      else if (!end)
          alert("Vui lòng nhập ngày kết thúc")
      else {
          start = new Date(start)
          end = new Date(end)
          if (start > end)
              alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc")
          else {
            loadData(params.device_id)
            .then((res) => {
              const valueList = res[0].valueList
              const newChartData = valueList.filter(item => {
                if (item.log_time >= start && item.log_time <= end)
                    console.log(item)
                    return item
              })
              setChartData(newChartData)
            })
          }
      }
  }

  const resetDate = function () {
    loadData(params.device_id)
      .then((res) => {
        const valueList = res[0].valueList
        const newChartData = valueList.slice(valueList.length - 10, valueList.length).map((data) => {
          return {
            log_time: data.log_time, 
            value: data.value,
          }
        })
        setChartData(newChartData)
      })
  }

  useEffect(() => {
    loadData(params.device_id)
      .then((res) => {
        const valueList = res[0].valueList
        const newChartData = valueList.slice(valueList.length - 10, valueList.length).map((data) => {
          return {
            log_time: data.log_time, 
            value: data.value,
          }
        })
        setChartData(newChartData)
      })
  }, [])

  const containerStyle = {
    width: '80%',
  }
 
  return (
    <div className="row mx-auto container">
      <SideBar />
      <div className='col-xl-9 col-md-9 mt-5 mx-auto'>
        <h1 className="text-center">Thống kê lịch sử</h1>

          <Row className="mt-4">
            <Col xs={3}>
                <Form.Group controlId="start">
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control size='sm' type="date"></Form.Control>
                </Form.Group>
            </Col>
            <Col xs={3}>
                <Form.Group controlId="end">
                <Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control size='sm' type="date"></Form.Control>
                </Form.Group>
            </Col>
            <Col>
                <Button type='submit' size='lg' variant='primary' onClick={handleChangeDate}>Lọc</Button>
            </Col>
            <Col>
                <Button type='submit' size='lg' variant='secondary' onClick={resetDate}>Reset</Button>
            </Col>
          </Row>

        <div className="d-flex flex-column align-items-center mt-3">
          <LineChart style={containerStyle} chartData={chartData} />
        </div>
      </div>
    </div>
  )
}
export default StatisticPage;