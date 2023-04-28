import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { handleDeviceRequest } from '../../../api/deviceApi';
function AddSensor() {
    // open-close modal
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // form data
    const [name, setName] = useState(null);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null)
    const [water, setWater] = useState(null);
    const [time, setTime] = useState(null);




    const params = useParams()
    const typ = params.device_type
    console.log('typ ne ' + typ);
    const sensor = ['soil', 'air', 'temp', 'light']
    let content
    if (sensor.includes(typ)) {
        content = <>
            <div className="d-flex my-3 align-items-center">
                Ngưỡng dưới - min:
                <input
                    type="text"
                    className="form-control w-25 mx-3"
                    onChange={e => setMin(e.target.value)}
                />
            </div>
            <div className="d-flex my-3 align-items-center">
                Ngưỡng trên - max:
                <input
                    type="text"
                    className="form-control w-25 mx-3"
                    onChange={e => setMax(e.target.value)}

                />
            </div>
        </>
    }
        
    else if (typ == "pump") {
        content = <>
            <div className="d-flex my-3 align-items-center">
                Lượng nước:
                <input
                    type="text"
                    className="form-control w-25 mx-3"
                    onChange={e => setWater(e.target.value)}
                />
            </div>
        </>
    } else {
        content = <>
            <div className="d-flex my-3 align-items-center">
                Thời gian chiếu sáng:
                <input
                    type="text"
                    className="form-control w-25 mx-3"
                    onChange={e => setTime(e.target.value)}
                />
            </div>
        </>
    }
    function handleAddRequest() {
        // alert('chuan bi them device ne');
        // alert('gar_id ne ' + params.gar_id)
        const deviceData = {
            request: "add",
            name: name,
            type: params.device_type, 
            owner: params.account,
            coordinates: {
                x: x,
                y: y
            }, 
            threshold: {
                min: min,
                max: max
            }, 
            water: water,
            time: time,
            garPiece: params.gar_id
        }
        if (!name) {
            alert('Vui lòng nhập tên thiết bị') 
        } else if (!x || !y) {
            alert('Vui lòng nhập tọa độ cho thiết bị')
        } else {
            if (params.device_type == "led" && !time)
                alert("Vui lòng nhập giờ chiếu sáng")
            else if (params.device_type == "pump" && !water) 
                alert("Vui lòng nhập lượng nước cần bơm") 
            else if (sensor.includes(params.device_type) && (!min || !max)) 
                alert('Vui lòng nhập ngưỡng giá trị cho cảm biến')
            else {
                // alert('Gửi form')
                const isSuccess = handleDeviceRequest(deviceData)
                if (isSuccess) {
                    alert('Thêm mới thiết bị thành công')
                    location.reload()
                }
            }
        }
    }
    return (
        <>
            <Button variant="dark" onClick={handleShow} className="btn-lg mx-2">
                Thêm thiết bị
            </Button>

            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                centered
            >
                <Modal.Header className="bg-dark" closeButton>
                    <Modal.Title className="d-flex align-items-center text-white">
                        Thêm thiết bị
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex my-3 align-items-center">
                        Tên thiết bị:
                        <input
                            type="text"
                            className="form-control w-25 mx-3"
                            placeholder="Cảm biến CDS - NVZ1"
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    {/* <div className="d-flex my-3 align-items-center">
                        Loại thiết bị:
                        <select className="form-select w-25 ms-3">
                            <option selected>Mặc định</option>
                            <option value="light">Sensor ánh sáng</option>
                            <option value="soil">Sensor độ ẩm đất</option>
                            <option value="air">Sensor độ ẩm không khí</option>
                            <option value="temp">Sensor độ ẩm không khí</option>
                            <option value="led">Đèn cảnh báo</option>
                            <option value="pump">Máy bơm</option>
                        </select> */}
                    {/* <input
                            type="text"
                            className="form-control w-50 mx-3"
                            placeholder="Quang trở"
                        /> */}
                    {/* </div> */}
                    <div className="d-flex my-3 align-items-center">
                        Tọa độ x:
                        <input
                            type="text"
                            className="form-control w-25 mx-3"
                            onChange={e => setX(e.target.value)}
                        />
                    </div>
                    <div className="d-flex my-3 align-items-center">
                        Tọa độ y:
                        <input
                            type="text"
                            className="form-control w-25 mx-3"
                            onChange={e => setY(e.target.value)}
                        />
                    </div>
                    {content}
                    {/* <div className="d-flex my-3 align-items-center">
                        Nhập lại mật khẩu:
                        <input
                            type="password"
                            className="form-control w-50 mx-3"
                            min={8}
                            max={20}
                        />
                    </div>
                    <div className="d-flex my-3 align-items-center">
                        Số điện thoại:
                        <input
                            type="tel"
                            className="form-control w-50 mx-3"
                            placeholder="0238647256"
                        />
                    </div>

                    <div className="d-flex my-3 align-items-center">
                        Địa chỉ:
                        <input
                            type="text"
                            className="form-control w-75 mx-3"
                            placeholder=" 268, Lý Thường Kiệt. P. 14, Q. 10"
                        />
                    </div> */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleAddRequest} size="lg">
                        Xác nhận
                    </Button>
                    <Button variant="secondary" onClick={handleClose} size="lg">
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddSensor;