---
title: "Sampling Foundations for Statistical Inference"
description: "Learn about samples and population in data, how sampling techniques are used for statistical inference."
thumbnail: "/images/sampling-foundations-for-statistical-inference-thumbnail.png"
createdAt: "2026-02-21"
updatedAt: "2026-02-21"
contributors:
  - "lv1607"
---

# Sampling Foundations for Statistical Inference

In statistics and predictive modeling, we rarely have the luxury of analyzing an entire **Population ($N$)**. Instead, we rely on a **Sample ($n$)**, a smaller subset used to make inferences about the larger group.

## What is a Sample?

A **Sample** is a smaller, manageable subset of a larger population. The goal of sampling is to collect evidence from this subset to make mathematical inferences about the whole group.

- **Population ($N$):** The entire group.
- **Sample ($n$):** The subset selected for analysis.

---

## 1. Probability Sampling Techniques

Probability sampling uses random selection, ensuring every unit has a known, non-zero probability of being chosen. This enables calculation of **Sampling Error**.

### Simple Random Sampling (SRS)

Every individual has an equal probability of selection.

**Formula:**

$$
P = \frac{n}{N}
$$

Where:
- $P$ = probability of selecting any individual unit  
- $n$ = sample size  
- $N$ = population size  

The sample mean is:

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$

Where:
- $\bar{x}$ = sample mean  
- $n$ = number of observations in the sample  
- $x_i$ = each individual observation  
- $\mu$ = population mean (the parameter being estimated)  

| Population ($N=12$) | Process | Sample ($n=3$) |
| :---: | :---: | :---: |
| 🔴 🔵 🟡 🟢 <br> 🔵 🔴 🟢 🟡 <br> 🟡 🟢 🔴 🔵 | $\xrightarrow{\text{Random Selection}}$ | 🔴 <br> 🟢 <br> 🟡 |


---

### Systematic Sampling

Selecting units at fixed intervals from an ordered population, starting from a random position.

**Formula:**

$$
k = \frac{N}{n}
$$

Where:
- $k$ = sampling interval  
- $N$ = population size  
- $n$ = desired sample size  

A random starting point $r$ is chosen such that $1 \le r \le k$, and the sample consists of:

$$
r,\; r+k,\; r+2k,\; \dots
$$

| Population ($N=12$) | Process | Sample ($n=2$) |
| :---: | :---: | :---: |
| ⚪ ⚪ ⚪ ⚪ **🔴** ⚪ <br> ⚪ ⚪ ⚪ **🔴** ⚪ ⚪ | $\xrightarrow{\text{Pick every } 5^{th} \text{ item}}$ | 🔴 <br> 🔴 |

---

### Stratified Sampling

Dividing the population into **Strata** and sampling proportionally from each group.

**Formula:**

$$
n_h = \left( \frac{N_h}{N} \right) \times n
$$

Where:
- $n_h$ = sample size from stratum $h$  
- $N_h$ = population size of stratum $h$  
- $N$ = total population size  
- $n$ = total sample size  

| Population (Strata) | Process | Sample (Representative) |
| :--- | :---: | :--- |
| 🔴 🔴 🔴 🔴 <br> 🔵 🔵 🔵 🔵 <br> 🟢 🟢 🟢 🟢 | $\xrightarrow{\text{Randomly sample } n_h \text{ from each}}$ | 🔴 <br> 🔵 <br> 🟢 |

**The Logic:**
The population is organized into homogeneous subgroups (strata) based on a specific characteristic (like M&M color). By sampling from every group, we ensure that the sample reflects the true diversity of the population, even for smaller minority groups.

---

### Cluster Sampling

Dividing the population into **Clusters**, randomly selecting clusters, and sampling all units within them.

**Formula:**

$$
\hat{Y} = \frac{M}{m} \sum_{i=1}^{m} y_i
$$

Where:
- $\hat{Y}$ = estimated population total  
- $M$ = total number of clusters in the population  
- $m$ = number of clusters sampled  
- $y_i$ = total value from cluster $i$  

| Population (Clusters) | Process | Sample (Selected Clusters) |
| :---: | :---: | :---: |
| [🔴 🔵] [🟡 🟢] <br> [🔵 🟡] [🟢 🔴] | $\xrightarrow{\text{Randomly select } m \text{ clusters}}$ | [🔵 🟡] <br> [🟢 🔴] |

**The Logic:**
The population is divided into heterogeneous groups (clusters) that each represent the whole. Instead of sampling individuals, we randomly select entire clusters and study every unit within them. This is highly cost-effective when the population is geographically spread out.

---

## 2. Non-Probability Sampling Techniques

Non-probability sampling does not use random selection. The probability of selection is unknown, which means sampling error cannot be formally calculated.

### Quota Sampling

Selecting units until predefined category targets are met.

This method ensures representation of certain characteristics but does not rely on randomness.

| Population (Categorized) | Process | Sample (Target Met) |
| :---: | :---: | :---: |
| 🔴 🔴 🔴 🔴 <br> 🔵 🔵 🔵 🔵 <br> 🟢 🟢 🟢 🟢 | $\xrightarrow{\text{Fill Quota: 2 Red, 2 Blue}}$ | 🔴 🔴 <br> 🔵 🔵 |

**Note:**
Unlike Stratified sampling, the selection within those groups is not random it often depends on who is easiest to reach first.

---

### Judgmental Sampling

The researcher selects units based on expertise or subjective judgment.

This is often used when specialized knowledge is required.

| Population (Diverse) | Process | Sample (Expert Selection) |
| :---: | :---: | :---: |
| 🔴 ⚪ ⚪ ⚪ <br> ⚪ ⚪ 🔴 ⚪ <br> ⚪ 🔴 ⚪ ⚪ | $\xrightarrow{\text{Researcher picks specific units}}$ | 🔴 <br> 🔴 <br> 🔴 |

**The Logic:**
Selection is driven by a specific purpose or research objective. Instead of relying on a random draw, the researcher deliberately picks individuals who are "most informative" or possess specific expertise relevant to the study.

---

### Snowball Sampling

Existing participants recruit future participants.

This is commonly used when studying hard-to-reach populations.

| Population (Hidden) | Selection Process (Referrals) | Final Sample (The Chain) |
| :--- | :---: | :--- |
| ⚪ ⚪ ⚪ ⚪ ⚪ <br> ⚪ 🔴 ⚪ 🔴 ⚪ <br> ⚪ ⚪ 🔴 ⚪ ⚪ <br> ⚪ 🔴 ⚪ 🔴 ⚪ | 🔴 <br> ↙ ↘ <br> 🔴 &nbsp;&nbsp; 🔴 <br> ↙ ↘ &nbsp;&nbsp; ↙ ↘ <br> 🔴 🔴 &nbsp; 🔴 🔴 | 🔴 <br> 🔴 🔴 <br> 🔴 🔴 🔴 🔴 |

**The Logic:**
Selection starts with a "seed" subject who meets the criteria. That subject then recruits or refers others from their network who also fit the criteria. This creates a branching tree structure, which is the only effective way to reach niche populations without a formal database.

---

### Convenience Sampling

Selecting units that are easiest to access.

This method is fast and inexpensive but highly prone to bias.

| Population (All) | Process | Sample (The Nearest) |
| :---: | :---: | :---: |
| 🔴 ⚪ 🔴 ⚪ <br> ⚪ ⚪ ⚪ ⚪ <br> 🔴 🔴 🔴 🔴 <br> ⚪ ⚪ ⚪ ⚪ | $\xrightarrow{\text{Pick the closest units}}$ | 🔴 🔴 <br> 🔴 🔴 |

**The Logic:**
This is the "handiest" method where the researcher samples whoever is nearby or currently available. While it is the fastest and cheapest method, it carries the highest risk of **Selection Bias** because it ignores everyone outside the immediate vicinity.

---

## Sampling in the ML Pipeline

- In Machine Learning, sampling is the foundation of model generalization. 
- By using **Stratified Sampling** to handle class imbalance and **Cluster Sampling** logic to prevent data leakage during train-test splits, we ensure that models perform accurately on unseen data.
- A sophisticated algorithm cannot fix a biased dataset , this is where sampling helps in stabilizing the model.
