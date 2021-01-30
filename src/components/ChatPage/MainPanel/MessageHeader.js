import React from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FaLock } from 'react-icons/fa';
import { MdFavorite } from 'react-icons/md';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { AiOutlineSearch } from 'react-icons/ai';
import Image from 'react-bootstrap/Image';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

function MessageHeader() {
    return (
        <div style ={{
            width: '100%',
            height: '170px',
            border: '.2rem solid #ececec',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
        }}>

        <Container>
        <Row>
            <Col><h2><FaLock></FaLock>ChatRoomName<MdFavorite></MdFavorite></h2></Col>  {/* <h2></h2>태그로 아이콘도 키울수 있음.. */}
            <Col>
                <InputGroup className="mb-3">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1"><AiOutlineSearch></AiOutlineSearch></InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        placeholder="Search Messages"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                    ></FormControl>
                </InputGroup>
            </Col>
        </Row>
            <div style={{ display:'flex', justifyContent: 'flex-end'}}>
                <p>
                    <Image src=""></Image>{" "}user name
                </p>

            </div>
        <Row>
            <Col>
                <Accordion>
                    <Card>
                        <Card.Header style={{ padding: '0 1rem'}}>
                            <Accordion.Toggle as={ Button } variant="link" eventKey="0">
                                Click me!
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>Hello! I'm the body</Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Col>
            <Col>
                <Accordion>
                        <Card>
                            <Card.Header style={{ padding: '0 1rem'}}>
                                <Accordion.Toggle as={ Button } variant="link" eventKey="0">
                                    Click me!
                                </Accordion.Toggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>Hello! I'm the body</Card.Body>
                            </Accordion.Collapse>
                        </Card>
                    </Accordion>
            </Col>
        </Row>
        </Container>

        </div>
    )
}

export default MessageHeader
