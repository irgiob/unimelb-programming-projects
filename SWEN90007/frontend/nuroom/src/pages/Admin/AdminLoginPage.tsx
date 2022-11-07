import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Content,
  Form,
  ButtonToolbar,
  Button,
  Panel,
  FlexboxGrid,
  Message,
  useToaster,
} from "rsuite";
import styled from "styled-components";
import { BASE_URL } from "../../constant/Endpoints";

export default function AdminLoginPage() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toaster = useToaster();
  const message = (
    <Message duration={3000} showIcon type={"error"}>
      Wrong password or no permission.
    </Message>
  );
  const infoMessage = (
    <Message duration={3000} showIcon type={"warning"}>
      Please filled in all required fields
    </Message>
  );
  const signIn = () => {
    console.log(email);
    console.log(password);
    if (email === "" || password === "") {
      toaster.push(infoMessage, { placement: "topCenter" });
    } else {
      setLoading(true);
      axios
        .post(BASE_URL + "/login", {
          email: email,
          password: password,
          roleLevel: 3,
        })
        .then((response) => {
          console.log("Fetched Clients data..", response.data);
          if (response.data.errorCode === 200) {
            sessionStorage.setItem(
              "adminInfo",
              JSON.stringify(response.data.args)
            );
            navigate("/adminHomepage");
          } else {
            toaster.push(message, { placement: "topCenter" });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  return (
    <Wrapper>
      <Container>
        <Content>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item colspan={12}>
              <Panel header={<h3>Admin login</h3>} bordered>
                <Form fluid>
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
