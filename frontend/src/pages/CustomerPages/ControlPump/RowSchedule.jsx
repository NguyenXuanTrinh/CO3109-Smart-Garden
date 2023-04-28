import {Table } from "react-bootstrap";
import DeleteSchedule from "./DeleteSchedule";
import EditSchedule from "./EditSchedule";
import { useEffect, useState } from "react";
// import { useState } from "react";

const RowSchedule = (props) => {
    const [listSchedule,setListSchedule] = useState(props.schedule);
    useEffect(() => {
        setListSchedule(props.schedule)
    },[props.schedule])
   
    const handleEdit = (id,schedule) => {
        // console.log(id)
        const newSche = listSchedule.map((date) => (date._id === id)?schedule:date)
        setListSchedule(newSche)
    }
    const handleDelete = (id) => {
        const newSche = listSchedule.filter((date) => (date._id !== id))
        setListSchedule(newSche)
    }
    const row = listSchedule.map((date,index) =>{ 
        let dateObj = "";
        if(date.type === "weekly" && date.dates.length > 3) {
            dateObj = new Date(date.dates).toString().substring(0,10);
        }
        else {
            dateObj = date.type === "weekly"?date.dates:date.dates.substring(0,10)
        }
        let type = ''
        if(date.type === "weekly"){
            type = "Hàng tuần"
        }
        if(date.type === "monthly"){
            type = "Hàng tháng"
        }
        if(date.type === "custom"){
            type = "Ngẫu nhiên"
        }
        return (
        <tr key={index}>
            <th>{date.time}</th>
            <th>{date.water}</th>
            <th>{type}</th>
            <th>{dateObj}</th>
            <th><EditSchedule schedule = {date} onEdit = {handleEdit}></EditSchedule></th>
            <th><DeleteSchedule id={date._id} onDelete = {handleDelete}/></th>
        </tr>
    )})
    return (
        <Table size="sm">
            <thead>
                <tr>
                    <th>Thời gian</th>
                    <th>Lượng nước</th>
                    <th>Loại</th>
                    <th>Ngày</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {row}
            </tbody>
        </Table>
    );
};

export default RowSchedule;