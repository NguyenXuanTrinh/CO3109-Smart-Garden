import classnames from 'classnames/bind'
import styles from './SensorHistory.module.scss'
import { Button, Form, Table, Container, Dropdown, DropdownButton, Col, Row, Stack, Pagination } from 'react-bootstrap'
import SideBar from '../../../components/GlobalStyles/SideBar'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getRecordList } from '../../../api/recordApi';
import { getDeviceList } from '../../../api/deviceApi'

const cx = classnames.bind(styles);

function SensorHistory() {
    const navigate = useNavigate()
    const [lastPage, setLastPage] = useState(1)
    const sensorPerPage = 5
    const [currentPage, setCurrentPage] = useState(1)
    const [startIndex, setStartIndex] = useState(1)

    const onPrev = () => {
        if (currentPage !== 1) {
            if (currentPage === startIndex) {
                setStartIndex(currentPage - 1)
            }
            setCurrentPage(currentPage - 1)
        }
    }

    const onNext = () => {
        if (currentPage !== lastPage) {
            if (currentPage === startIndex + 2) {
                setStartIndex(startIndex + 1)
            }
            setCurrentPage(currentPage + 1)
        }
    }

    const onFirst = () => {
        setCurrentPage(1)
        setStartIndex(1)
    }

    const onLast = () => {
        setCurrentPage(lastPage)
        setStartIndex(lastPage - 2)
    }

    const params = useParams()
    const [device, setDevice] = useState([])
    const [record, setRecord] = useState([])
    const [rawRecord, setRawRecord] = useState([])
    // let deviceName = []
    const loadDevice = async () => {
        try {
            let deviceList = await getDeviceList(params.account)
            deviceList = deviceList.filter(elem => elem.garPiece == params.garden_id)
            // alert('gar_id ne ' + params.garden_id)
            setDevice(deviceList)
            // deviceName = deviceList.map(device => <Dropdown.Item href="">{device.name}</Dropdown.Item>)
        } catch (err) {
            console.log(err)
        }

    }

    const loadRecord = async (device_id) => {
        try {
            let recordList = await getRecordList(device_id)
            if (!recordList[0]) {
                setRawRecord([])
                setRecord([])
            }

            let valueList = recordList[0].valueList
            setRawRecord(valueList)
            let type = recordList[0].type
            valueList = valueList.map((item, index) => {
                let controller = "Hệ thống"
                const ran = Math.floor(Math.random() * 2)
                if ((type == "maybom" || type == "den") && ran == 1)
                    controller = params.account
                return (
                    <tr key={index}>
                        <td>{controller}</td>
                        <td>{item.log_time}</td>
                        <td>{item.value}</td>
                    </tr>
                )
            })
            setLastPage(Math.ceil(valueList.length / 5))
            setRecord(valueList)

        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        loadDevice()
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        const device_id = document.getElementById('device-type').value
        const stat = document.getElementById('stat')
        stat.setAttribute('href', window.location.href + '/' + device_id)
        document.getElementById('device_id').innerHTML = `id: ${device_id}`
        loadRecord(device_id)
    };

    const handleChangeDate = (e) => {
        e.preventDefault()
        let start = document.getElementById("start").value
        let end = document.getElementById("end").value
        if (!start)
            alert("Vui lòng nhập ngày bắt đầu")
        else if (!end)
            alert("Vui lòng nhập ngày kết thúc")
        else {
            start = new Date(start).toISOString()
            end = new Date(end).toISOString()
            if (start > end)
                alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc")
            else {
                let newRecord = rawRecord.filter(item => {
                    if (item.log_time >= start && item.log_time <= end)
                        return item
                })
                console.log("new record")
                console.log(newRecord)
                newRecord = newRecord.map((item, index) => {
                    let controller = "Hệ thống"
                    const ran = Math.floor(Math.random() * 2)
                    if (ran == 1)
                        controller = params.account
                    return (
                        <tr key={index}>
                            <td>{controller}</td>
                            <td>{item.log_time}</td>
                            <td>{item.value}</td>
                        </tr>
                    )
                })
                setRecord(newRecord)
            }
        }
    }

    const returnGardenDetail = () => {
        navigate(`/${params.account}/garden-detail/${params.garden_id}`)
    }

    return (
        <div className="row mx-auto container">
            <SideBar position="garden" account={params.account}/>
            <div className='col-xl-9 col-md-9 mt-3 px-5 mx-auto'>
                <a href="" className={cx("return")}>
                    <i className="fa-solid fa-arrow-left" onClick={returnGardenDetail}></i>
                </a>
                <h1 className="text-center">Lịch sử hoạt động</h1>

                <div className="row">
                    <div className="col-4 text-center my-4">
                        <form onSubmit={handleSubmit} className='d-flex justify-content-around'>
                            <select className="form-select form-select-lg  w-50" aria-label=".form-select-lg example" name="device-type" id="device-type">
                                <option defaultValue>Default</option>
                                {device.map((item, index) => <option key={index} value={item.id}>{item.name}</option>)}

                            </select>
                            <button type='submit' className='btn btn-dark'>Chọn</button>
                            {/* <select readOnly htmlFor="select" className="form-select form-select-lg " >
                                
                            </select> */}

                        </form>
                    </div>
                    <div className="col-4 text-center my-4">
                        {/* <Button type='submit' size='lg' variant='dark'>Tải về</Button> */}
                        <div id="device_id" className='my-2'>id: </div>
                    </div>
                    <div className="col-4 text-center my-4">
                        <Button id='stat' className='me-5 float-end' size='lg' variant='dark' as='a' href='/StatisticPage'>Thống kê hoạt động</Button>
                    </div>
                </div>
                <Row>
                    <Col xs={2} className='my-auto'>
                        {/* <Dropdown.Header>Chọn loại thiết bị</Dropdown.Header> */}

                    </Col>

                    <Col xs={2} className='my-auto'>
                    </Col>
                    <Col xs={3}>

                    </Col>
                    <Col xs={3}>

                    </Col>
                    <Col>


                    </Col>
                </Row>
                <div className='text-center'>
                    <Table striped bordered hover className={cx('tbl')}>
                        <thead>
                            <tr>
                                <th>Người điều khiển</th>
                                <th>Thời gian</th>
                                <th>Giá trị </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            {/* {
                            deviceVal.map((device, index) => <DataRow key={index} index={index} time={device.log_time} value={device.value} />)
                        } */}
                            {record.slice(currentPage * sensorPerPage - 5, currentPage * sensorPerPage)}
                        </tbody>
                    </Table>
                </div>

                {/* <stu /> */}

                <Pagination className='justify-content-center'>
                    <Pagination.First onClick={onFirst} />
                    <Pagination.Prev onClick={onPrev} />
                    <Pagination.Item onClick={() => setCurrentPage(startIndex)} key='first' className={currentPage - startIndex === 0 ? 'active' : ''}>{startIndex}</Pagination.Item>
                    <Pagination.Item onClick={() => setCurrentPage(startIndex + 1)} key='second' className={currentPage - startIndex === 1 ? 'active' : ''}>{startIndex + 1}</Pagination.Item>
                    <Pagination.Item onClick={() => setCurrentPage(startIndex + 2)} key='third' className={currentPage - startIndex === 2 ? 'active' : ''}>{startIndex + 2}</Pagination.Item>
                    <Pagination.Next onClick={onNext} />
                    <Pagination.Last onClick={onLast} />
                </Pagination>
                <div>
                    <div className="row">
                        <div className="col-4 text-center">
                            <Form.Group controlId="start">
                                <Form.Label>Ngày bắt đầu</Form.Label>
                                <Form.Control size='sm' type="date"></Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-4 text-center">
                            <Form.Group controlId="end">
                                <Form.Label>Ngày kết thúc</Form.Label>
                                <Form.Control size='sm' type="date"></Form.Control>
                            </Form.Group>
                        </div>
                        <div className="col-4 text-center my-4" onClick={handleChangeDate}>
                            <Button type='submit' size='md' variant='dark'>Lọc</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SensorHistory;