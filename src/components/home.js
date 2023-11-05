import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import appwriteApi from '../api/appwriteApi';
import { Query } from 'appwrite';
import Chart from 'chart.js/auto';

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    // Fetch expenses from the Appwrite API for the current month
    appwriteApi.filterDocuments("653df5de65e78c507e6e", "653df5e84943e468bea1", [Query.between("Date", "01-10-2023 00:00:00.000", "31-10-2023 00:00:00.000")])
    .then((response) => {
      setExpenses(response);
    })
    .catch((error) => {
      console.error('Error fetching expenses:', error);
    });

    // Fetch categories from the Appwrite API
    appwriteApi.listDocuments("653df5de65e78c507e6e","6547bc0399cdee92f12d")
    .then((response) => {
      setCategories(response.documents);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
    });
  }, [currentMonth]);

  const expenseData = expenses.map((expense) => {
    return {
      label: expense.category,
      value: expense.amount,
    };
  });

  const categoryNames = categories.map((category) => category.name);
  const categoryExpenses = categoryNames.map((categoryName) => {
    return expenseData.reduce((acc, expense) => {
      if (expense.label === categoryName) {
        return acc + expense.value;
      }
      return acc;
    }, 0);
  });

  const chartData = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Expenses',
        data: categoryExpenses,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1>Expense Dashboard - Current Month</h1>
      <Bar data={chartData} />
    </div>
  );
};

export default ExpenseDashboard;
