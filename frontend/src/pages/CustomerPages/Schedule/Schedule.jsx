import { useState } from 'react';
import {Container, Row, Col, Form, Button} from 'react-bootstrap';
import SideBar from '../../../components/GlobalStyles/SideBar';
import Custom from './Custom';
import Monthly from './Monthly';
import Weekly from './Weekly';
import { postSchedule } from '../../../api/schedule';
import {useNavigate, useParams } from 'react-router-dom';


const Schedule = () => {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState({
        water:"",
        time:"",
        dates:[]
    });
    const user = useParams();
    const handleChangeWeekly = (obj) => {
        setSchedule((sche)=>({
            ...sche,
            type:"weekly",
            dates:obj
        }))
    }
    const handleChangeMonthly = (obj) => {
        // console.log(obj);
        // setDate(() =>( {
        //     type:"monthly",
        //     ...obj
        // }))
        setSchedule((sche)=>({
            ...sche,
            type:"monthly",
            "dates":obj
        }))
    }
    const handleChangeCustom = (obj) => {
        // setDate(() => ({
            
        // }));
        setSchedule((sche)=>({
            ...sche,
            type:"custom",
            "dates":obj
        }))
    }
    const handleChangeTime = (e) => {
        // console.log(e.target.value);
        // setTime(e.target.value);
        setSchedule((sche)=>({
            ...sche,
            "time":e.target.value,
        }))
    }
    const handleChangeWater = (e) => {
        // console.log(e.target.value);
        // setWater(e.target.value);
        setSchedule((sche)=>({
            ...sche,
            "water":e.target.value,
        }))
    }
    const handleClick = () => {
        console.log(schedule.water)
        if(schedule.time.length === 0){
            alert("Thời gian không được bỏ trống")
        }
        else if(schedule.water.length=== 0 ){
            alert("Lượng nước không được bỏ trống")
        }
        else if(schedule.dates.length === 0){
            alert("Ngày tưới không được bỏ trống")
        }
        else if(Number(schedule.water) < 0){
            alert("Lượng nước không thể âm")
        }
        else{
            postSchedule({
                ...schedule,
                owner:user.account
            })
            navigate(`../${user.account}/controlPump/${user.garden_id}`)
        }
    }
    return (
        <Container>
            <Row>
                <SideBar position = "garden" account={user.account}/>
                <Col>
                    <h1>Thêm lịch tưới</h1>
                    <Form>
                        <Form.Group onChange={handleChangeTime}>
                            <Form.Label>Time</Form.Label>
                            <Form.Control size="lg" type="time" />
                        </Form.Group>
                    
                        <Form.Group onChange={handleChangeWater}>
                            <Form.Label>Lượng nước</Form.Label>
                            <Form.Control size="lg" type="number" />
                        </Form.Group>
                        
                        <Form.Label>Lặp lại</Form.Label>
                    </Form>
                    <div className="square border rounded">
                        <Weekly onChange = {handleChangeWeekly} />
                        <Monthly onChange = {handleChangeMonthly} />
                        <Custom onChange = {handleChangeCustom} />                  
                    </div>
                    <Button size = 'lg' className='my-2' onClick = {handleClick}> Lưu</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default Schedule;