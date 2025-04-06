package com.milkman.DTO;

public class SignUpRequest {
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String password;
    private String role;
    private int noOfFamilyMembers;
    private double dailyMilkRequired;

    public int getNoOfFamilyMembers() {
        return noOfFamilyMembers;
    }

    public void setNoOfFamilyMembers(int noOfFamilyMembers) {
        this.noOfFamilyMembers = noOfFamilyMembers;
    }

    public double getDailyMilkRequired() {
        return dailyMilkRequired;
    }

    public void setDailyMilkRequired(double dailyMilkRequired) {
        this.dailyMilkRequired = dailyMilkRequired;
    }

    public SignUpRequest(String name, String email, String phoneNumber, String address, String password, String role, int noOfFamilyMembers, double dailyMilkRequired) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.password = password;
        this.role = role;
        this.noOfFamilyMembers = noOfFamilyMembers;
        this.dailyMilkRequired = dailyMilkRequired;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
