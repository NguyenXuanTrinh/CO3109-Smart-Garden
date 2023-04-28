import classnames from 'classnames/bind'
import styles from './InputValue.module.scss'
import { Form, Container, Button, Row, Col } from 'react-bootstrap'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SideBar from '../../../components/GlobalStyles/SideBar';
import { useEffect, useState } from 'react';
import { getThreshold, postUserInput } from '../../../api/deviceApi';
const cx = classnames.bind(styles);

const InputValue = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location.state)
    const user = useParams();
    const [data,setData] = useState({
        minTemp:"",
        maxTemp:"",
        soil:"",
        maxSoil:""
    });
    // const getData = () => return await 
    useEffect(() => {
        getThreshold().then((res) => setData(res)).catch((err) => console.log(err))
    },[])
    const handleMinTemp = (e) => {
        setData((value) => ({
            ...value,
            minTemp:e.target.value
        }))
    }
    const handleMaxTemp = (e) => {
        setData((value) => ({
            ...value,
            maxTemp:e.target.value
        }))
    }
    const handleSoil = (e) => {
        setData((value) => ({
            ...value,
            soil:e.target.value
        }))
    }
    const handleMaxSoil = (e) => {
        setData((value) => ({
            ...value,
            maxSoil:e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(data)
        if(data.minTemp < 0 || data.maxTemp < 0 || data.soil < 0 || data.maxSoil < 0){
            alert("Không được nhập giá trị âm")
        }
        else if(data.minTemp >= data.maxTemp){
            alert("Giá trị nhiệt độ min không được lớn hơn giá trị max")
        }
        else if(data.soil >= data.maxSoil){
            alert("Độ ẩm mong muốn không được lớn hơn độ ẩm tối đa")
        }
        else{
            postUserInput({
                ...data,
                owner:user.account,
            }).then((res) => {
                if(res.status === 200) navigate(location.state.prevPath,{state:data})
            })
        }
    }

    function returnGardenDashboard() {
        navigate(`/${user.account}/dashboard/${user.garden_id}`)
    }

    return (
        <Container>
        <Row>
            <SideBar position="garden" account={user.account}/>
            <Col xs='9'>
                <i className="fa-solid fa-arrow-left" onClick={returnGardenDashboard}></i>
                <h1 className={cx('title')}>Thiết lập ngưỡng giá trị</h1>
                <div className={cx('input-form')}>
                    <Form>
                        <Form.Group className="py-3 px-3" controlId="minTemp" onChange={handleMinTemp}>
                            <Form.Label>Nhiệt độ tối thiểu</Form.Label>
                            <Form.Control type="number"  defaultValue={data.minTemp} min={0}/>                      
                        </Form.Group>

                        <Form.Group className="py-3 px-3" controlId="maxTemp" onChange={handleMaxTemp}>
                            <Form.Label>Nhiệt độ tối đa</Form.Label>
                            <Form.Control type="number" defaultValue={data.maxTemp}/>                      
                        </Form.Group>

                        <Form.Group className="py-3 px-3" controlId="soil" onChange={handleSoil}>
                            <Form.Label>Độ ẩm đất cần duy trì</Form.Label>
                            <Form.Control type="number" defaultValue={data.soil}/>                      
                        </Form.Group>

                        <Form.Group className="py-3 px-3" controlId="maxSoil" onChange={handleMaxSoil}>
                            <Form.Label>Độ ẩm đất tối đa</Form.Label>
                            <Form.Control type="number" defaultValue={data.maxSoil}/>                      
                        </Form.Group>
                        <div className='text-center mb-2'>
                            <Button className={cx('button')} variant="success" type="submit" onClick={handleSubmit}>Lưu</Button>
                        </div>
s                    </Form>
                </div>

            </Col>
        </Row>
            
        </Container>

    );
};

export default InputValue;