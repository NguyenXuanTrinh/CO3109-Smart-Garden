import { useEffect, useState } from 'react';
import {Row, Col, Container, Button, ToggleButton, ButtonGroup, Modal} from 'react-bootstrap'
import SideBar from '../../../components/GlobalStyles/SideBar';
import RowSchedule from './RowSchedule';
import classnames from 'classnames/bind'
import styles from './ControlPump.module.scss'
import { getCurValuePump, getCurValueTemp } from '../../../api/adafruitApi';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { deleteAll, getListSchedule, manualPump } from '../../../api/schedule';
import { getThreshold } from '../../../api/deviceApi';
import { controlAutoPump } from '../../../api/controlObserverApi';
import { getAllRecord } from '../../../api/recordApi';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';

const cx = classnames.bind(styles);
const data1 = [
    {
        id:'1',
        time:'2023-03-16T19:41',
        date:'23/02/2023',
        amount:'1000'
    },
    {
        id:'2',
        time:'2023-03-16T19:41',
        date:'23/02/2023',
        amount:'1000'
    },
    {
        id:'3',
        time:'2023-03-16T19:41',
        date:'23/02/2023',
        amount:'1000'
    },
    {
        id:'4',
        time:'2023-03-16T19:41',
        date:'23/02/2023',
        amount:'1000'
    },
    {
        id:'5',
        time:'2023-03-16T19:41',
        date:'23/02/2023',
        amount:'1000'
    },
    {
        id:'6',
        time:'2023-03-16T19:41',
        date:'23/02/2023',
        amount:'1000'
    }
]
const ControlPump = () => {
    const user = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [soil,setSoil] = useState('');
    const [pumpSchedule,setPumpSchedule] = useState(true);
    const [pumpMoisture,setPumpMoisture] = useState(false);
    const [pumpManual,setPumpManual] = useState(false);
    const [data,setData] = useState([{
        time:"",
        water:"",
        dates:""
    }]);
    const [show,setShow] = useState(false);
    const handleClickSchedule = () => {
        setPumpSchedule((state) => setPumpSchedule(!state));
    }
    const handleClickMoistureOn = () => {
        setPumpMoisture(true)
        controlAutoPump(true).then(res => console.log(res)).catch(err => console.log(err))
    }
    const handleClickMoistureOff = () => {
        setPumpMoisture(false)
        controlAutoPump(false).then(res => console.log(res)).catch(err => console.log(err))
    }
    const handleClickManualOn = () => {
        manualPump(true,user.account);
        setPumpManual(true)
        // console.log(new Date().toISOString())
    }
    const handleClickManualOff = () => {
        manualPump(false,user.account);
        setPumpManual(false)
        // console.log(new Date().toISOString())
    }
    // useEffect(() => {
    //     console.log(pumpManual)
    //     manualPump(pumpManual,user.account);
    // },[pumpManual])
    
    const getData = async () => {
        return await getListSchedule().then((res) => {
            res.sort((a,b) => a.dates.localeCompare(b.dates))
            // console.log(res[0].dates - res[1].dates)
            setData(res)
        }).catch((err) => console.log(err));
    }
    useEffect(() => {
        if(location.state)setSoil(location.state.soil)
        else{
            getThreshold().then((res) => setSoil(res.soil)).catch((err)=>console.log(err))
        }
        getData();
    },[pumpManual])

    
    // const intervalObj = setInterval(()=>{
    //     getDataAdafruit();
    // },2000)
    // useEffect(() => {
    //     getDataAdafruit();
    // },[pumpManual])
    useEffect(() => {
        const getDataAdafruit = async () => {
            return await getAllRecord().then(res => {
                if(res.find(obj => obj.type === 'pump').curValue === 'OFF') setPumpManual(false)
                else if(res.find(obj => obj.type === 'pump').curValue === 'ON') setPumpManual(true)
            }).catch(err => console.log(err))
        }
        const interval = setInterval(() => getDataAdafruit(),3000)
        return () => {
            clearInterval(interval);
        }
    },[])
    const handleDelete = () => {
        deleteAll()
        setData([])
        setShow(false)
    }
    const returnGardenDetail = () => {
        navigate(`/${user.account}/garden-detail/${user.garden_id}`)
      }

    return (
        <Container>
            <Row>
                <SideBar position="garden" account={user.account}/>
                
                <Col className="mx-2">
                    <i className="fa-solid fa-arrow-left" onClick={returnGardenDetail}></i>
                    <h1>Quản lý tưới cây</h1>  
                    <Row className={cx('box')}>
                        <Col xs={3} className={cx('center')}>
                            <div>
                                <h2>Tưới theo lịch</h2>
                            </div>
                            {/* <ButtonGroup className=''>
                                <ToggleButton
                                onClick={handleClickSchedule}
                                variant={pumpSchedule? 'primary' : 'secondary'}
                                size="lg"
                                >ON</ToggleButton>
                                
                                <ToggleButton
                                onClick={handleClickSchedule}
                                variant={pumpSchedule? 'secondary' : 'primary'}
                                size="lg"
                                >OFF</ToggleButton>
                            </ButtonGroup> */}
                        </Col>
                        <Col xs={9} className={cx('center')}>
                            <RowSchedule schedule = {data}/>
                            <Link className={cx('px-5')} to={{pathname:`/${user.account}/schedule/${user.garden_id}`}}><Button size="lg">Thêm lịch</Button></Link>
                            <Button size="lg" variant="secondary" onClick={() => setShow(true)}>Xóa tất cả</Button>
                        </Col>

                    </Row>
                    <Row className={cx('row','py-5')}>
                        <Col className={cx('box','sm-box','col-left')}>
                            <div className={cx('center')}>   
                                <h2>Tưới theo độ ẩm</h2>
                                <ButtonGroup>
                                    <Button
                                    onClick={handleClickMoistureOn}
                                    variant={pumpMoisture? 'primary' : 'secondary'}
                                    size="lg"
                                    >ON
                                    </Button>
                                    <Button
                                    onClick={handleClickMoistureOff}
                                    variant={pumpMoisture? 'secondary' : 'primary'}
                                    size="lg"
                                    >OFF
                                    </Button>
                                </ButtonGroup>
                            </div>
                            <div className={cx(`${!pumpMoisture?'opacity-25':''}`,'center')} >
                                <h2>{soil}%</h2>
                                <Button onClick={() => {navigate(`../${user.account}/InputValue/${user.garden_id}`,{state: { prevPath: location.pathname}} )}}>Thiết Lập</Button>
                            </div>
                        </Col>
                        <Col className={cx('box','sm-box')}>
                        <div className={cx('center')}>
                            <div>
                                <h2>Tưới thủ công</h2>
                            </div>
                            <ButtonGroup>
                                <Button
                                onClick={handleClickManualOn}
                                variant={pumpManual? 'primary' : 'secondary'}
                                size="lg"
                                >ON
                                </Button>
                                <Button
                                onClick={handleClickManualOff}
                                variant={pumpManual? 'secondary' : 'primary'}
                                size="lg"
                                >OFF
                                </Button>
                            </ButtonGroup>
                        </div>   
                        </Col>

                    </Row>
                </Col>
            </Row>
            
        {/* <Modal show={show} onHide={}>
            <Modal.Body>
                Bạn có muốn xóa tất cả
                <Button onClick={handleDelete}>Xóa</Button>
                <Button onClick={}>Hủy</Button>
            </Modal.Body>
        </Modal> */}
            <Modal show = {show} onHide={()=>setShow(false)} centered>
                <Modal.Header className="bg-danger" closeButton>
                    <Modal.Title>Xóa lịch tưới</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Bạn có muốn xóa lịch tưới ?</h4>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDelete}>Xóa</Button>
                    <Button variant="secondary" onClick={() => setShow(false)}>Hủy</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ControlPump;