package utils;

public class Result<T> {
    private T args;
    private Integer errorCode;
    private String errorMessage;

    public Result() {
    }

    public Result(T args, Integer errorCode, String errorMessage) {
        this.args = args;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }

    public Integer getErrorCode() {
        return this.errorCode;
    }

    public void setErrorCode(Integer errorCode) {
        this.errorCode = errorCode;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public T getArgs() {
        return this.args;
    }

    public void setArgs(T args) {
        this.args = args;
    }

    @Override
    public String toString() {
        return "Result{" +
                "args=" + args +
                ", errorCode=" + errorCode +
                ", errorMessage='" + errorMessage + '\'' +
                '}';
    }
}