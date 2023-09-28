import React from "react";
import Web_ClientSurvey from "../../components/client/Web_ClientSurvey";

const ClientSurvey = () => {
  return (
    <div>
      {" "}
      <h1>ClientSurvey</h1>
      <h3>방배정을 위한 설문입니다: </h3>
      <div>Q1. 당신은 누구입니까?
        <input type="radio" name="role" value="senior"/> 새섬
        <input type="radio" name="role" value="freshman"/> 새내기
        <input type="radio" name="role" value="team"/> 팀원
      </div>
      <div>Q2.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>
      <div>Q3.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>
      <div>Q4.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>
      <div>Q5.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>
      <div>Q6.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>
      <div>Q7.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>
      <div>Q8.ㅇㅇㅇㅇ에 자신의 ㅁㅁ?<br></br>
        <textarea name="comments" rows="4" cols="50"></textarea>
      </div>

    </div>
  );
};

export default ClientSurvey;
