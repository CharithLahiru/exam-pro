package com.logicx.exampro.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "USERS")
public class User {

    @Id
    @Column(name = "USERNAME", length = 30)
    private String username;

    @Column(name = "FIRSTNAME", length = 50)
    private String firstName;

    @Column(name = "LASTNAME", length = 50)
    private String lastName;

    @Column(name = "PASSWORD", length = 20)
    private String password;

    @Column(name = "CREATEDBY", length = 30)
    private String createdBy;

    @Column(name = "CREATEDATE")
    private LocalDateTime createDate;

    @Column(name = "EMAIL", length = 30)
    private String email;

    @Column(name = "MOBILE", length = 20)
    private String mobile;

    @Column(name = "ISACTIVE", length = 2)
    private String isActive;

    @Column(name = "ACCOUNTTYPE", length = 10)
    private String accountType;

    @Column(name = "IMAGEREF", length = 200)
    private String imageRef;

    @Column(name = "LASTLOGINTIME")
    private LocalDateTime lastLoginTime;

    public User() {
    }

    public User(String username, String firstName, String lastName, String password, String createdBy, LocalDateTime createDate, String email, String mobile, String isActive, String accountType, String imageRef, LocalDateTime lastLoginTime) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.createdBy = createdBy;
        this.createDate = createDate;
        this.email = email;
        this.mobile = mobile;
        this.isActive = isActive;
        this.accountType = accountType;
        this.imageRef = imageRef;
        this.lastLoginTime = lastLoginTime;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreateDate() {
        return createDate;
    }

    public void setCreateDate(LocalDateTime createDate) {
        this.createDate = createDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getIsActive() {
        return isActive;
    }

    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getImageRef() {
        return imageRef;
    }

    public void setImageRef(String imageRef) {
        this.imageRef = imageRef;
    }

    public LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }
}
