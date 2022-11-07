import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Container,
  Header,
  Content,
  Footer,
  Form,
  ButtonToolbar,
  Button,
  Navbar,
  Panel,
  FlexboxGrid,
  Radio,
  RadioGroup,
  Message,
  useToaster,
} from "rsuite";
import styled from "styled-components";
import { ErrorMessage, WarningMessage } from "../components/NuMessage";
import { BASE_URL } from "../constant/Endpoints";
import { toasterMsg } from "../services/utils";

export default function LoginPage() {
  let navigate = useNavigate();
  const [role, setRole] = useState("Customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleChange = (val: any) => {
    console.log(val);
    setRole(val);
  };
  const signIn = () => {
    let roleLevel = role === "Customer" ? 1 : 2;
    console.log(email);
    console.log(password);
    console.log(roleLevel);
    if (email === "" || password === "") {
      toasterMsg(WarningMessage("Please fill in all fields."));
    } else {
      setLoading(true);

      axios
        .post(BASE_URL + "/login", {
          email: email,
          password: password,
          roleLevel: roleLevel,
        })
        .then((response) => {
          console.log("Login res..", response.data);
          let res = response.data;
          if (res.errorCode === 200) {
            console.log(res.roleLevel)
            let navPage =
              res.args.roleLevel === 2 ? "/hotelierHomepage" : "/homepage";
            let info = res.args.roleLevel === 2 ? "hotelierInfo" : "customerInfo";
            console.log(navPage)
            sessionStorage.setItem(info, JSON.stringify(res.args));
            navigate(navPage);
          } else {
            toasterMsg(ErrorMessage(res.errorMessage));
          }

      setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        })
    }
  };
  return (
    <Wrapper>
      <Container>
        <Content>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={12}>
              <Panel header={<h3>Welcome to NüRoom</h3>} bordered>
                <Form fluid>
                  <div>
                    <div>Sign in as </div>
                    <Form.Group controlId="radioList">
                      <RadioGroup
                        value={role}
                        onChange={(val) => handleChange(val)}
                        name="radioList"
                        inline
                      >
                        <Radio value="Customer">Customer</Radio>
                        <Radio value="Hotelier">Hotelier</Radio>
                      </RadioGroup>
                    </Form.Group>
                  </div>
                  <Form.Group>
                    <Form.ControlLabel>Email address</Form.ControlLabel>
                    <Form.Control
                      value={email}
                      onChange={(val: string) => setEmail(val)}
                      name="name"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.ControlLabel>Password</Form.ControlLabel>
                    <Form.Control
                      value={password}
                      onChange={(val: string) => setPassword(val)}
                      name="password"
                      type="password"
                      autoComplete="off"
                    />
                  </Form.Group>
                  <Form.Group>
                    <ButtonToolbar>
                      <Button
                        onClick={signIn}
                        loading={loading}
                        appearance="primary"
                      >
                        Sign in
                      </Button>
                    </ButtonToolbar>
                  </Form.Group>
                </Form>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  padding-top: 100px;
  justify-content: center;
  align-items: center;
`;
