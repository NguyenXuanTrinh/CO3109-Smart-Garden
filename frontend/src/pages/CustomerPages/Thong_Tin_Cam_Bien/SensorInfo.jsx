import { Row, Col } from "react-bootstrap";

function SensorInfo({type, name, x, y, install_date, status}) {
    const icon_style = {
        height: '2rem'
    }

    let icon_src, icon_alt;
    switch (type) {
        case "temp":
            icon_src = "/images/Icon_nhiet_do.svg"
            icon_alt = "nhiệt độ"
            break
        case "soil":
            icon_src = "/images/Icon_do_am_dat.svg"
            icon_alt = "độ ẩm đất"
            break
        case "air":
            icon_src = "/images/Icon_do_am_khong_khi.svg"
            icon_alt = "độ ẩm không khí"
            break
        case "light":
            icon_src = "/images/Icon_anh_sang.png"
            icon_alt = "ánh sáng"
            break
        default:
            icon_src = "/images/Icon_may_bom.png"
            icon_alt = "máy bơm"
    }

    const date = new Date(install_date)

    return (
        <Row className='my-3'>
          <Col md={{span: 1}} className="d-flex justify-content-center">
            <img src={icon_src} alt={icon_alt} style={icon_style}/>
          </Col>
          <Col md={{span: 3}}>{name}</Col>
          <Col md={{span: 2}}>{x}</Col>
          <Col md={{span: 2}}>{y}</Col>
          <Col md={{span: 2}}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</Col>
          <Col md={{span: 2}}>{status === true ? "Bình thường" : "Đang bảo trì"}</Col>
        </Row>
    )
}

export default SensorInfo